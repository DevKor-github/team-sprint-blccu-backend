import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { DataSource, EntityManager, UpdateResult } from 'typeorm';
import {
  ICommentsServiceArticleIdValidCheck,
  ICommentsServiceCreateComment,
  ICommentsServiceDeleteComment,
  ICommentsServiceFindComments,
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

@Injectable()
export class CommentsService {
  constructor(
    private readonly svc_notifications: NotificationsService,
    private readonly repo_comments: CommentsRepository,
    private readonly db_dataSource: DataSource,
  ) {}

  async postsIdValidCheck({
    parentId,
    articleId,
  }: ICommentsServiceArticleIdValidCheck): Promise<void> {
    const parent = await this.existCheck({ commentId: parentId });
    if (parent.articleId != articleId)
      throw new BadRequestException(
        '게시글 아이디가 루트 댓글이 작성된 게시글 아이디와 일치하지 않습니다.',
      );
    if (parent.parentId)
      throw new BadRequestException('부모 댓글이 루트 댓글이 아닙니다.');
  }

  async existCheck({ commentId }: ICommentsServiceId): Promise<CommentDto> {
    const comment = await this.repo_comments.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException(
        '댓글의 아이디를 찾을 수 없습니다. 존재하지 않거나 이미 삭제되었습니다.',
      );
    }
    return comment;
  }

  async createComment(
    createCommentDto: ICommentsServiceCreateComment,
  ): Promise<CommentChildrenDto> {
    const post = await this.db_dataSource.manager.findOne(Article, {
      where: { id: createCommentDto.articleId },
    });
    if (post.allowComment === false)
      throw new ForbiddenException('댓글이 허용되지 않은 게시물 입니다.');
    if (createCommentDto.parentId)
      await this.postsIdValidCheck({
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
    const { commentId } = commentData.identifiers[0];
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

  async patchComment({
    userId,
    articleId,
    commentId,
    content,
  }: ICommentsServicePatchComment): Promise<CommentDto> {
    const commentData = await this.existCheck({ commentId });
    if (!commentData) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (commentData.articleId != articleId)
      throw new NotFoundException('루트 게시글의 아이디가 일치하지 않습니다.');
    if (commentData.userId != userId)
      throw new ForbiddenException('댓글을 수정할 권한이 없습니다.');
    commentData.content = content;
    return await this.repo_comments.save(commentData);
  }

  async fetchComments({
    articleId,
  }: ICommentsServiceFindComments): Promise<CommentsGetResponseDto[]> {
    return await this.repo_comments.fetchComments({ articleId });
  }

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
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
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
          throw new NotFoundException('삭제할 댓글이 존재하지 않습니다');
      }
    });
  }
}
