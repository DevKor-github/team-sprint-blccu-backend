import { DataSource, Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowsRepository extends Repository<Follow> {
  constructor(private dataSource: DataSource) {
    super(Follow, dataSource.createEntityManager());
  }

  async getFollowers({ kakaoId, loggedUser }) {
    const queryBuilder = this.getFollowQuery({ kakaoId, loggedUser });
    const followings = await queryBuilder
      .innerJoin('follow.from_user', 'user')
      .andWhere('follow.toUserKakaoId = :kakaoId')
      .getRawMany();
    return followings.map((follower) => ({
      username: follower.username,
      kakaoId: follower.kakaoId,
      handle: follower.handle,
      follower_count: follower.follower_count,
      following_count: follower.following_count,
      isAdmin: follower.isAdmin === 1,
      description: follower.description,
      profile_image: follower.profile_image,
      background_image: follower.background_image,
      date_created: follower.date_created,
      date_deleted: follower.date_deleted,
      isFollowing: follower.isFollowing === 1, // MySQL에서는 boolean 값이 1 또는 0으로 반환될 수 있음
    }));
  }

  async getFollowings({ kakaoId, loggedUser }) {
    const queryBuilder = this.getFollowQuery({ kakaoId, loggedUser });
    const followings = await queryBuilder
      .innerJoin('follow.to_user', 'user')
      .andWhere('follow.fromUserKakaoId = :kakaoId')
      .getRawMany();
    return followings.map((follower) => ({
      username: follower.username,
      kakaoId: follower.kakaoId,
      handle: follower.handle,
      follower_count: follower.follower_count,
      following_count: follower.following_count,
      isAdmin: follower.isAdmin === 1,
      description: follower.description,
      profile_image: follower.profile_image,
      background_image: follower.background_image,
      date_created: follower.date_created,
      date_deleted: follower.date_deleted,
      isFollowing: follower.isFollowing === 1, // MySQL에서는 boolean 값이 1 또는 0으로 반환될 수 있음
    }));
  }

  getFollowQuery({ kakaoId, loggedUser }) {
    const queryBuilder = this.createQueryBuilder('follow')
      .where('user.date_deleted IS NULL')
      .select([
        'user.username AS username',
        'user.kakaoId AS kakaoId',
        'user.handle AS handle',
        'user.follower_count AS follower_count',
        'user.following_count AS following_count',
        'user.isAdmin AS isAdmin',
        'user.username AS username',
        'user.description AS description',
        'user.profile_image AS profile_image',
        'user.background_image AS background_image',
        'user.date_created AS date_created',
        'user.date_deleted AS date_deleted',
        'CASE WHEN follow.fromUserKakaoId = :loggedUser THEN true ELSE false END AS isFollowing',
      ])
      .setParameters({ kakaoId, loggedUser });

    return queryBuilder;
  }
}
