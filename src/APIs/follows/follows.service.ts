import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FollowUserDto } from './dtos/follow-user.dto';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import { FollowsRepository } from './follows.repository';
import { UserResponseDtoWithFollowing } from '../users/dtos/user-response.dto';
import { User } from '../users/entities/user.entity';
import {
  IFollowsServiceGetList,
  IFollowsServiceUsers,
} from './interfaces/follows.service.interface';

@Injectable()
export class FollowsService {
  constructor(
    private readonly followsRepository: FollowsRepository,
    private readonly dataSource: DataSource,
  ) {}

  isSame({ from_user, to_user }: IFollowsServiceUsers): boolean {
    if (from_user == to_user) {
      return true;
    }
    return false;
  }

  async getScope({
    from_user,
    to_user,
  }: IFollowsServiceUsers): Promise<OpenScope[]> {
    if (from_user === to_user)
      return [OpenScope.PUBLIC, OpenScope.PROTECTED, OpenScope.PRIVATE];
    if (from_user !== null && to_user !== null) {
      const follow = await this.followsRepository.findOne({
        where: {
          from_user: { kakaoId: from_user },
          to_user: { kakaoId: to_user },
        },
      });
      if (follow) {
        return [OpenScope.PUBLIC, OpenScope.PROTECTED];
      }
    }

    return [OpenScope.PUBLIC];
  }

  async isExist({
    from_user,
    to_user,
  }: IFollowsServiceUsers): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
      where: {
        from_user: { kakaoId: from_user },
        to_user: { kakaoId: to_user },
      },
      loadRelationIds: true,
    });
    if (!follow) {
      return false;
    }
    return true;
  }

  async followUser({
    from_user,
    to_user,
  }: IFollowsServiceUsers): Promise<FollowUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const toUserData = await queryRunner.manager.findOne(User, {
        where: { kakaoId: to_user },
      });
      const fromUserData = await queryRunner.manager.findOne(User, {
        where: { kakaoId: from_user },
      });

      const isExist = await this.isExist({ from_user, to_user });
      if (isExist) {
        throw new ConflictException('already exists');
      }
      if (this.isSame({ from_user, to_user })) {
        throw new ConflictException('you cannot follow yourself!');
      }
      const follow = await this.followsRepository.save({
        from_user: { kakaoId: from_user },
        to_user: { kakaoId: to_user },
      });
      await queryRunner.manager.update(User, fromUserData.kakaoId, {
        following_count: () => 'following_count +1',
      });
      await queryRunner.manager.update(User, toUserData.kakaoId, {
        follower_count: () => 'follower_count +1',
      });
      await queryRunner.commitTransaction();
      return await this.followsRepository.findOne({ where: { id: follow.id } });
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async unfollowUser({
    from_user,
    to_user,
  }: IFollowsServiceUsers): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const toUserData = await queryRunner.manager.findOne(User, {
        where: { kakaoId: to_user },
      });
      const fromUserData = await queryRunner.manager.findOne(User, {
        where: { kakaoId: from_user },
      });

      const isExist = await this.isExist({ from_user, to_user });

      if (!isExist) {
        throw new ConflictException('no data exists');
      }

      if (this.isSame({ from_user, to_user })) {
        throw new ConflictException('you cannot unfollow yourself!');
      }

      await queryRunner.manager.update(User, fromUserData.kakaoId, {
        following_count: () => 'following_count -1',
      });
      await queryRunner.manager.update(User, toUserData.kakaoId, {
        follower_count: () => 'follower_count -1',
      });
      await this.followsRepository.delete({
        from_user: { kakaoId: from_user },
        to_user: { kakaoId: to_user },
      });
      await queryRunner.commitTransaction();
      return;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getFollows({
    kakaoId,
    loggedUser,
  }: IFollowsServiceGetList): Promise<UserResponseDtoWithFollowing[]> {
    const follows = await this.followsRepository.getFollowings({
      kakaoId,
      loggedUser,
    });
    return follows;
  }

  async getFollowers({
    kakaoId,
    loggedUser,
  }: IFollowsServiceGetList): Promise<UserResponseDtoWithFollowing[]> {
    const follows = await this.followsRepository.getFollowers({
      kakaoId,
      loggedUser,
    });
    return follows;
  }
}
