import { DataSource } from 'typeorm';
import { UsersRepository } from '../users.repository';
import { Feedback } from 'src/APIs/feedbacks/entities/feedback.entity';
import { Comment } from 'src/APIs/comments/entities/comment.entity';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { Notification } from 'src/APIs/notifications/entities/notification.entity';
import { Follow } from 'src/APIs/follows/entities/follow.entity';
import { User } from '../entities/user.entity';
import { Agreement } from 'src/APIs/agreements/entities/agreement.entity';
import { getUUID } from '@/utils/uuid.utils';
import { Injectable } from '@nestjs/common';
import { IUsersServiceDelete } from '../interfaces/users.service.interface';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { EXCEPTIONS } from '@/common/blccu-exception';

@Injectable()
export class UsersDeleteService {
  constructor(
    private readonly repo_users: UsersRepository,
    private readonly db_dataSource: DataSource,
  ) {}

  @ExceptionMetadata([
    EXCEPTIONS.QUERY_FAILED_ERROR,
    EXCEPTIONS.ENTITY_NOT_FOUND_ERROR,
    EXCEPTIONS.TRANSACTION_ALREADY_STARTED_ERROR,
    EXCEPTIONS.TRANSACTION_NOT_STARTED_ERROR,
    EXCEPTIONS.PESSIMISTIC_LOCK_TRANSACTION_REQUIRED_ERROR,
  ])
  async deleteUser({
    userId,
    type,
    content,
  }: IUsersServiceDelete): Promise<void> {
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 피드백 생성
      await queryRunner.manager.save(Feedback, {
        type,
        content,
        userId,
      });
      const commentsToDelete = await queryRunner.manager.find(Comment, {
        where: { userId },
      });
      for (const commentData of commentsToDelete) {
        let childrenData = [];
        if (commentData.parentId == null)
          childrenData = await queryRunner.manager.find(Comment, {
            where: { parentId: commentData.id },
          });
        if (childrenData.length == 0) {
          await queryRunner.manager.delete(Comment, {
            id: commentData.id,
            user: { id: userId },
          });
          await queryRunner.manager.update(Article, commentData.articleId, {
            commentCount: () => 'comment_count - 1',
          });
        } else {
          await queryRunner.manager.softDelete(Comment, {
            user: { id: userId },
            id: commentData.id,
          });
        }
      }
      await queryRunner.manager.delete(Notification, {
        targetUserId: userId,
      });
      await queryRunner.manager.softDelete(Article, { userId });
      // 연동된 댓글 soft delete
      await queryRunner.manager.softDelete(Comment, { userId });
      // 팔로우 일괄 취소
      const followingsToDelete = await queryRunner.manager.find(Follow, {
        where: { fromUserId: userId },
      });
      await queryRunner.manager.delete(Follow, { fromUserId: userId });
      await queryRunner.manager.update(
        User,
        { id: userId },
        {
          followingCount: 0,
          followerCount: 0,
        },
      );
      for (const following of followingsToDelete) {
        await queryRunner.manager.decrement(
          User,
          { id: following.toUserId },
          'followerCount',
          1,
        );
      }
      // 팔로잉 일괄 취소
      const followersToDelete = await queryRunner.manager.find(Follow, {
        where: { toUserId: userId },
      });
      await queryRunner.manager.delete(Follow, { toUserId: userId });
      for (const following of followersToDelete) {
        await queryRunner.manager.decrement(
          User,
          { id: following.fromUserId },
          'followingCount',
          1,
        );
      }
      await queryRunner.manager.delete(Agreement, { userId: userId });
      const userData = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      const userTempName = 'USER' + getUUID().substring(0, 8);
      userData.username = userTempName;
      userData.handle = userTempName;
      userData.description = '';
      userData.profileImage = '';
      userData.backgroundImage = '';
      await queryRunner.manager.save(User, userData);
      await queryRunner.manager.softDelete(User, { id: userId });
      await queryRunner.commitTransaction();
      return;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
