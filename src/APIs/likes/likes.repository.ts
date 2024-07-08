import { DataSource, Repository } from 'typeorm';
import { Follow } from '../follows/entities/follow.entity';
import { Injectable } from '@nestjs/common';
import { ILikesRepositoryIds } from './interfaces/likes.repository.interface';
import { Like } from './entities/like.entity';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { convertToCamelCase, getClassFields } from 'src/utils/classUtils';
import { UserDto } from '../users/dtos/common/user.dto';
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
    const users = await this.createQueryBuilder('likes')
      .innerJoin('likes.posts', 'posts')
      .leftJoin('likes.user', 'user')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow.toUserKakaoId', 'toUserKakaoId')
            .from(Follow, 'follow')
            .where('follow.fromUserKakaoId = :kakaoId');
        },
        'follow',
        'follow.toUserKakaoId = user.kakaoId',
      )
      .where('user.date_deleted IS NULL')
      .andWhere('posts.date_deleted IS NULL')
      .andWhere('likes.postsId = :id')
      .select([
        ...getClassFields(UserDto).map(
          (column) => `user.${column} AS ${column}`,
        ),
        'CASE WHEN follow.toUserKakaoId IS NOT NULL THEN true ELSE false END AS is_following',
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
