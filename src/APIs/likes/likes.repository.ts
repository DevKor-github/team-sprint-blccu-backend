import { DataSource, Repository } from 'typeorm';
import { Likes } from './entities/like.entity';
import { Follow } from '../follows/entities/follow.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesRepository extends Repository<Likes> {
  constructor(private dataSource: DataSource) {
    super(Likes, dataSource.createEntityManager());
  }
  async getLikes({ kakaoId, postsId }) {
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
      .andWhere('likes.postsId = :postsId')
      .select([
        'user.username AS username',
        'user.kakaoId AS kakaoId',
        'user.handle AS handle',
        'user.isAdmin AS isAdmin',
        'user.description AS description',
        'user.profile_image AS profile_image',
        'user.background_image AS background_image',
        'user.date_created AS date_created',
        'user.date_deleted AS date_deleted',
        'CASE WHEN follow.toUserKakaoId IS NOT NULL THEN true ELSE false END AS isFollowing',
      ])
      .setParameters({ postsId, kakaoId })
      .getRawMany();

    return users.map((user) => ({
      username: user.username,
      kakaoId: user.kakaoId,
      handle: user.handle,
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
