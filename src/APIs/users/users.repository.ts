import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Follow } from '../follows/entities/follow.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  getFollowQuery({ kakaoId }) {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow.to_user', 'toUserKakaoId')
            .from(Follow, 'follow')
            .where('follow.fromUserKakaoId = :kakaoId', { kakaoId });
        },
        'follow',
        'follow.toUserKakaoId = user.kakaoId',
      )
      .where('user.date_deleted IS NULL')
      .select([
        'user.username AS username',
        'user.kakaoId AS kakaoId',
        'user.handle AS handle',
        'user.isAdmin AS isAdmin',
        'user.username AS username',
        'user.follow_count AS follow_count',
        'user.description AS description',
        'user.profile_image AS profile_image',
        'user.background_image AS background_image',
        'user.date_created AS date_created',
        'user.date_deleted AS date_deleted',
        'CASE WHEN follow.toUserKakaoId IS NOT NULL THEN true ELSE false END AS isFollowing',
      ])
      .setParameters({ kakaoId });

    return queryBuilder;
  }
  // 팔로잉 유무 포함 조회
  async fetchUsersWithNameAndFollowing({ kakaoId, username }) {
    const queryBuilder = this.getFollowQuery({ kakaoId });
    const users = await queryBuilder
      .andWhere('LOWER(user.username) LIKE LOWER(:username)', {
        username: `%${username}%`,
      })
      .setParameters({ username: `%${username}%` })
      .getRawMany();

    return users.map((user) => ({
      username: user.username,
      kakaoId: user.kakaoId,
      handle: user.handle,
      follow_count: user.follow_count,
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
