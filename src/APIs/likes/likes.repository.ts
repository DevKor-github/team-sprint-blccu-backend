import { DataSource, Repository } from 'typeorm';
import { Follow } from '../follows/entities/follow.entity';
import { Injectable } from '@nestjs/common';
import { ILikesRepositoryIds } from './interfaces/likes.repository.interface';
import { Like } from './entities/like.entity';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';

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
        'user.username AS username',
        'user.kakaoId AS kakaoId',
        'user.handle AS handle',
        'user.follower_count AS follower_count',
        'user.following_count AS following_count',
        'user.isAdmin AS isAdmin',
        'user.description AS description',
        'user.profile_image AS profile_image',
        'user.background_image AS background_image',
        'user.date_created AS date_created',
        'user.date_deleted AS date_deleted',
        'CASE WHEN follow.toUserKakaoId IS NOT NULL THEN true ELSE false END AS isFollowing',
      ])
      .setParameters({ articleId, userId })
      .getRawMany();

    return users.map((user) => ({
      username: user.username,
      kakaoId: user.kakaoId,
      handle: user.handle,
      follower_count: user.follower_count,
      following_count: user.following_count,
      isAdmin: user.isAdmin === 1,
      description: user.description,
      profile_image: user.profile_image,
      background_image: user.background_image,
      date_created: user.date_created,
      date_deleted: user.date_deleted,
      isFollowing: user.isFollowing === 1,
    }));
  }
}
