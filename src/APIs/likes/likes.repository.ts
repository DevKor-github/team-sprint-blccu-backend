import { DataSource, Repository } from 'typeorm';
import { Follow } from '../follows/entities/follow.entity';
import { Injectable } from '@nestjs/common';
import { ILikesRepositoryIds } from './interfaces/likes.repository.interface';
import { Like } from './entities/like.entity';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { convertToCamelCase, getUserFields } from 'src/utils/classUtils';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LikesRepository extends Repository<Like> {
  constructor(private dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }
  async getLikes({
    userId,
    articleId,
  }: ILikesRepositoryIds): Promise<UserFollowingResponseDto[]> {
    const users = await this.createQueryBuilder('like')
      .innerJoin('like.article', 'article')
      .leftJoin('like.user', 'user')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow.to_user_id', 'to_user_id')
            .from(Follow, 'follow')
            .where('follow.from_user_id = :userId');
        },
        'follow',
        'follow.to_user_id = user.id',
      )
      .where('user.date_deleted IS NULL')
      .andWhere('article.date_deleted IS NULL')
      .andWhere('like.articleId = :articleId')
      .select([
        ...getUserFields().map((column) => `user.${column} AS ${column}`),
        'CASE WHEN follow.to_user_id IS NOT NULL THEN true ELSE false END AS is_following',
      ])
      .setParameters({ articleId, userId })
      .getRawMany();

    return users.map((user) =>
      plainToClass(UserFollowingResponseDto, {
        ...convertToCamelCase(user),
        isAdmin: user.is_admin === 1,
        isFollowing: user.is_following === 1,
      }),
    );
  }
}
