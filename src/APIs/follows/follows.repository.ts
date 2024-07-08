import { DataSource, Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { Injectable } from '@nestjs/common';
import { IFollowsRepositoryFindList } from './interfaces/follows.repository.interface';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { UserDto } from '../users/dtos/common/user.dto';
import { convertToCamelCase, getClassFields } from 'src/utils/classUtils';
import { plainToClass } from 'class-transformer';

@Injectable()
export class FollowsRepository extends Repository<Follow> {
  constructor(private dataSource: DataSource) {
    super(Follow, dataSource.createEntityManager());
  }

  async getFollowers({
    userId,
    loggedUser,
  }: IFollowsRepositoryFindList): Promise<UserFollowingResponseDto[]> {
    const followings = await this.createQueryBuilder('follow')
      .innerJoin('follow.from_user', 'user')
      .where('user.date_deleted IS NULL')
      .andWhere('follow.toUserKakaoId = :kakaoId')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow2.toUserKakaoId', 'toUserKakaoId')
            .from(Follow, 'follow2')
            .where('follow2.fromUserKakaoId = :loggedUser');
        },
        'follow2',
        'follow2.toUserKakaoId = user.kakaoId',
      )
      .select([
        ...getClassFields(UserDto).map(
          (column) => `user.${column} AS ${column}`,
        ),
        'CASE WHEN follow2.toUserKakaoId IS NOT NULL THEN true ELSE false END AS is_following',
      ])
      .setParameters({ userId, loggedUser })
      .getRawMany();

    return followings.map((follower) =>
      plainToClass(UserFollowingResponseDto, {
        ...convertToCamelCase(follower),
        isAdmin: follower.is_admin === 1,
        isFollowing: follower.is_following === 1,
      }),
    );
  }

  async getFollowings({
    userId,
    loggedUser,
  }: IFollowsRepositoryFindList): Promise<UserFollowingResponseDto[]> {
    const followings = await this.createQueryBuilder('follow')
      .innerJoin('follow.to_user', 'user')
      .where('user.date_deleted IS NULL')
      .andWhere('follow.fromUserKakaoId = :kakaoId')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow2.toUserKakaoId', 'toUserKakaoId')
            .from(Follow, 'follow2')
            .where('follow2.fromUserKakaoId = :loggedUser');
        },
        'follow2',
        'follow2.toUserKakaoId = user.kakaoId',
      )
      .select([
        ...getClassFields(UserDto).map(
          (column) => `user.${column} AS ${column}`,
        ),
        'CASE WHEN follow2.toUserKakaoId IS NOT NULL THEN true ELSE false END AS isFollowing',
      ])
      .setParameters({ userId, loggedUser })
      .getRawMany();

    return followings.map((follower) =>
      plainToClass(UserFollowingResponseDto, {
        ...convertToCamelCase(follower),
        isAdmin: follower.is_admin === 1,
        isFollowing: follower.is_following === 1,
      }),
    );
  }
}
