import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Follow } from '../follows/entities/follow.entity';
import { plainToClass } from 'class-transformer';
import { convertToCamelCase } from 'src/utils/class.utils';
import { UserFollowingResponseDto } from './dtos/response/user-following-response.dto';
import { USER_PRIMARY_RESPONSE_DTO_KEYS } from './dtos/response/user-primary-response.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private db_dataSource: DataSource) {
    super(User, db_dataSource.createEntityManager());
  }

  getFollowQuery({ userId }) {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('follow.to_user_id', 'to_user_id')
            .from(Follow, 'follow')
            .where('follow.from_user_id = :userId', { userId });
        },
        'follow',
        'follow.to_user_id = user.id',
      )
      .where('user.dateDeleted IS NULL')
      .select([
        ...USER_PRIMARY_RESPONSE_DTO_KEYS.map((column) => {
          return `user.${column} AS ${column}`;
        }),
        'CASE WHEN follow.to_user_id IS NOT NULL THEN true ELSE false END AS is_following',
      ])
      .setParameters({ userId });
    return queryBuilder;
  }
  // 팔로잉 유무 포함 조회
  async readWithNameAndFollowing({
    userId,
    username,
  }): Promise<UserFollowingResponseDto[]> {
    const queryBuilder = this.getFollowQuery({ userId });
    const users = await queryBuilder
      // .andWhere('MATCH(user.username) AGAINST (:username IN BOOLEAN MODE)', {
      //   username: `*${username}*`,
      // })
      .andWhere('LOWER(user.username) LIKE LOWER(:username)', {
        username: `%${username}%`,
      })
      .getRawMany();

    return users.map((user) =>
      plainToClass(UserFollowingResponseDto, {
        ...convertToCamelCase(user),
        isFollowing: user.is_following === 1,
      }),
    );
  }
}
