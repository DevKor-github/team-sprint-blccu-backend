import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { DataSource, EntityManager, UpdateResult } from 'typeorm';
import {
  ICommentsServiceArticleIdValidCheck,
  ICommentsServiceCreateComment,
  ICommentsServiceDeleteComment,
  ICommentsServiceFindComments,
  ICommentsServiceFindUserComments,
  ICommentsServiceId,
  ICommentsServicePatchComment,
} from './interfaces/comments.service.interface';
import { Comment } from './entities/comment.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotType } from 'src/common/enums/not-type.enum';
import { CommentDto } from './dtos/common/comment.dto';
import { CommentChildrenDto } from './dtos/common/comment-children.dto';
import { Article } from '../articles/entities/article.entity';
import { CommentsGetResponseDto } from './dtos/response/comments-get-response.dto';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class CommentsService {
  constructor(
    private readonly svc_notifications: NotificationsService,
    private readonly repo_comments: CommentsRepository,
    private readonly db_dataSource: DataSource,
  ) {}

  @ExceptionMetadata([
    EXCEPTIONS.INVALID_ARTICLE_REQUEST,
    EXCEPTIONS.INVALID_PARENT_COMMENT_REQUEST,
  ])
  async articleIdValidCheck({
    parentId,
    articleId,
  }: ICommentsServiceArticleIdValidCheck): Promise<void> {
    const parent = await this.existCheck({ commentId: parentId });
    if (parent.articleId != articleId)
      throw new BlccuException('INVALID_ARTICLE_REQUEST');
    if (parent.parentId)
      throw new BlccuException('INVALID_PARENT_COMMENT_REQUEST');
  }

  @ExceptionMetadata([EXCEPTIONS.COMMENT_NOT_FOUND])
  async existCheck({ commentId }: ICommentsServiceId): Promise<CommentDto> {
    const comment = await this.repo_comments.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new BlccuException('COMMENT_NOT_FOUND');
    }
    return comment;
  }

  @MergeExceptionMetadata([
    { service: CommentsService, methodName: 'articleIdValidCheck' },
    { service: NotificationsService, methodName: 'emitAlarm' },
  ])
  @ExceptionMetadata([EXCEPTIONS.FORBIDDEN_ACCESS])
  async createComment(
    createCommentDto: ICommentsServiceCreateComment,
  ): Promise<CommentChildrenDto> {
    const articleData = await this.db_dataSource.manager.findOne(Article, {
      where: { id: createCommentDto.articleId },
    });
    if (articleData.allowComment === false)
      throw new BlccuException('FORBIDDEN_ACCESS');
    if (createCommentDto.parentId)
      await this.articleIdValidCheck({
        parentId: createCommentDto.parentId,
        articleId: createCommentDto.articleId,
      });
    await this.db_dataSource.manager.update(
      Article,
      createCommentDto.articleId,
      {
        commentCount: () => 'comment_count +1',
      },
    );

    const commentData = await this.repo_comments.insertComment({
      createCommentDto,
    });
    const commentId = commentData.identifiers[0].id;

    const { article, parent, ...result } =
      await this.repo_comments.fetchCommentWithNotiInfo({ commentId });

    if (result.parentId && parent.userId != result.userId) {
      await this.svc_notifications.emitAlarm({
        userId: result.userId,
        targetUserId: parent.userId,
        type: NotType.REPLY,
        articleId: result.articleId,
      });
    }
    // 자신에게 알림 보내는 경우 생략
    if (result.userId != article.userId) {
      await this.svc_notifications.emitAlarm({
        userId: result.userId,
        targetUserId: article.userId,
        type: NotType.COMMENT,
        articleId: result.articleId,
      });
    }

    return result;
  }

  @ExceptionMetadata([
    EXCEPTIONS.NOT_THE_OWNER,
    EXCEPTIONS.INVALID_ARTICLE_REQUEST,
    EXCEPTIONS.COMMENT_NOT_FOUND,
  ])
  async patchComment({
    userId,
    articleId,
    commentId,
    content,
  }: ICommentsServicePatchComment): Promise<CommentDto> {
    const commentData = await this.existCheck({ commentId });
    if (!commentData) throw new BlccuException('COMMENT_NOT_FOUND');
    if (commentData.articleId != articleId)
      throw new BlccuException('INVALID_ARTICLE_REQUEST');
    if (commentData.userId != userId) throw new BlccuException('NOT_THE_OWNER');
    commentData.content = content;
    return await this.repo_comments.save(commentData);
  }

  async fetchComments({
    articleId,
  }: ICommentsServiceFindComments): Promise<CommentsGetResponseDto[]> {
    return await this.repo_comments.fetchAll({ articleId });
  }

  async fetchUserComments({
    userId,
  }: ICommentsServiceFindUserComments): Promise<CommentDto[]> {
    return await this.repo_comments.find({
      where: { userId },
      order: { dateCreated: 'DESC' },
      take: 10,
    });
  }

  @ExceptionMetadata([
    EXCEPTIONS.ARTICLE_NOT_FOUND,
    EXCEPTIONS.COMMENT_NOT_FOUND,
  ])
  @MergeExceptionMetadata([
    { service: CommentsService, methodName: 'existCheck' },
  ])
  async delete({
    commentId,
    userId,
    articleId,
  }: ICommentsServiceDeleteComment): Promise<void> {
    await this.db_dataSource.transaction(async (manager: EntityManager) => {
      const data = await this.existCheck({ commentId });
      let childrenData = [];
      let deletedResult: UpdateResult;
      if (data.articleId !== articleId) {
        throw new BlccuException('ARTICLE_NOT_FOUND');
      }
      if (data.parentId == null)
        childrenData = await manager.find(Comment, {
          where: { parentId: data.id },
        });
      if (childrenData.length == 0) {
        await manager.delete(Comment, { user: { id: userId }, id: commentId });
        await manager.update(Article, data.articleId, {
          commentCount: () => 'comment_count - 1',
        });
      } else {
        deletedResult = await manager.softDelete(Comment, {
          user: { id: userId },
          id: commentId,
        });
        if (deletedResult.affected < 1)
          throw new BlccuException('COMMENT_NOT_FOUND');
      }
    });
  }
}
