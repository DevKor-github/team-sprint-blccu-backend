import { DataSource, Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { Injectable } from '@nestjs/common';
import { IFollowsRepositoryFindList } from './interfaces/follows.repository.interface';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { convertToCamelCase, getUserFields } from 'src/utils/classUtils';
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
      .innerJoin('follow.fromUser', 'user')
      .where('user.date_deleted IS NULL')
      .andWhere('follow.to_user_id = :userId')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow2.to_user_id', 'to_user_id')
            .from(Follow, 'follow2')
            .where('follow2.from_user_id = :loggedUser');
        },
        'follow2',
        'follow2.to_user_id = user.id',
      )
      .select([
        ...getUserFields().map((column) => `user.${column} AS ${column}`),
        'CASE WHEN follow2.to_user_id IS NOT NULL THEN true ELSE false END AS is_following',
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
      .innerJoin('follow.toUser', 'user')
      .where('user.date_deleted IS NULL')
      .andWhere('follow.from_user_id = :userId')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow2.to_user_id', 'to_user_id')
            .from(Follow, 'follow2')
            .where('follow2.from_user_id = :loggedUser');
        },
        'follow2',
        'follow2.to_user_id = user.id',
      )
      .select([
        ...getUserFields().map((column) => `user.${column} AS ${column}`),
        'CASE WHEN follow2.to_user_id IS NOT NULL THEN true ELSE false END AS is_following',
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
