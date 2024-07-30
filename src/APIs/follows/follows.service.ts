import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import { FollowsRepository } from './follows.repository';
import { User } from '../users/entities/user.entity';
import {
  IFollowsServiceFindList,
  IFollowsServiceUsers,
} from './interfaces/follows.service.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { NotType } from 'src/common/enums/not-type.enum';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { FollowDto } from './dtos/common/follow.dto';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';

@Injectable()
export class FollowsService {
  constructor(
    private readonly repo_follows: FollowsRepository,
    private readonly svc_notifications: NotificationsService,
    private readonly db_dataSource: DataSource,
  ) {}

  isSame({ fromUser, toUser }: IFollowsServiceUsers): boolean {
    if (fromUser == toUser) {
      return true;
    }
    return false;
  }

  async getScope({
    fromUser,
    toUser,
  }: IFollowsServiceUsers): Promise<OpenScope[]> {
    if (fromUser === toUser)
      return [OpenScope.PUBLIC, OpenScope.PROTECTED, OpenScope.PRIVATE];
    if (fromUser !== null && toUser !== null) {
      const following = await this.repo_follows.findOne({
        where: {
          fromUser: { id: fromUser },
          toUser: { id: toUser },
        },
      });
      const follower = await this.repo_follows.findOne({
        where: {
          fromUser: { id: toUser },
          toUser: { id: fromUser },
        },
      });
      if (following && follower) {
        return [OpenScope.PUBLIC, OpenScope.PROTECTED];
      }
      if (following) return [OpenScope.PUBLIC];
      if (follower) return [OpenScope.PUBLIC];
    }

    return [OpenScope.PUBLIC];
  }

  async existCheckWithoutValidation({
    fromUser,
    toUser,
  }: IFollowsServiceUsers): Promise<boolean> {
    const follow = await this.repo_follows.findOne({
      where: {
        fromUser: { id: fromUser },
        toUser: { id: toUser },
      },
      loadRelationIds: true,
    });
    if (!follow) {
      return false;
    }
    return true;
  }

  @MergeExceptionMetadata([
    { service: FollowsService, methodName: 'existCheckWithoutValidation' },
    { service: NotificationsService, methodName: 'emitAlarm' },
  ])
  @ExceptionMetadata([
    EXCEPTIONS.ALREADY_EXISTS,
    EXCEPTIONS.SELF_ACTION_NOT_ALLOWED,
  ])
  async followUser({
    fromUser,
    toUser,
  }: IFollowsServiceUsers): Promise<FollowDto> {
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const toUserData = await queryRunner.manager.findOne(User, {
        where: { id: toUser },
      });
      const fromUserData = await queryRunner.manager.findOne(User, {
        where: { id: fromUser },
      });

      const isExist = await this.existCheckWithoutValidation({
        fromUser,
        toUser,
      });
      if (isExist) {
        throw new BlccuException('ALREADY_EXISTS');
      }
      if (this.isSame({ fromUser, toUser })) {
        throw new BlccuException('SELF_ACTION_NOT_ALLOWED');
      }
      const follow = await this.repo_follows.save({
        fromUser: { id: fromUser },
        toUser: { id: toUser },
      });
      await queryRunner.manager.update(User, fromUserData.id, {
        followingCount: () => 'following_count +1',
      });
      await queryRunner.manager.update(User, toUserData.id, {
        followerCount: () => 'follower_count +1',
      });

      await queryRunner.commitTransaction();
      await this.svc_notifications.emitAlarm({
        userId: fromUser,
        targetUserId: toUser,
        type: NotType.FOLLOW,
        articleId: null,
      });
      return await this.repo_follows.findOne({ where: { id: follow.id } });
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  @MergeExceptionMetadata([
    { service: FollowsService, methodName: 'existCheckWithoutValidation' },
  ])
  @ExceptionMetadata([
    EXCEPTIONS.ALREADY_EXISTS,
    EXCEPTIONS.SELF_ACTION_NOT_ALLOWED,
  ])
  async unfollowUser({
    fromUser,
    toUser,
  }: IFollowsServiceUsers): Promise<void> {
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const toUserData = await queryRunner.manager.findOne(User, {
        where: { id: toUser },
      });
      const fromUserData = await queryRunner.manager.findOne(User, {
        where: { id: fromUser },
      });

      const isExist = await this.existCheckWithoutValidation({
        fromUser,
        toUser,
      });

      if (!isExist) {
        throw new BlccuException('FOLLOW_NOT_FOUND');
      }

      if (this.isSame({ fromUser, toUser })) {
        throw new BlccuException('SELF_ACTION_NOT_ALLOWED');
      }

      await queryRunner.manager.update(User, fromUserData.id, {
        followingCount: () => 'following_count -1',
      });
      await queryRunner.manager.update(User, toUserData.id, {
        followerCount: () => 'follower_count -1',
      });
      await this.repo_follows.delete({
        fromUser: { id: fromUser },
        toUser: { id: toUser },
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

  async findFollowings({
    userId,
    loggedUser,
  }: IFollowsServiceFindList): Promise<UserFollowingResponseDto[]> {
    const follows = await this.repo_follows.getFollowings({
      userId,
      loggedUser,
    });
    return follows;
  }

  async findFollowers({
    userId,
    loggedUser,
  }: IFollowsServiceFindList): Promise<UserFollowingResponseDto[]> {
    const follows = await this.repo_follows.getFollowers({
      userId,
      loggedUser,
    });
    return follows;
  }
}
