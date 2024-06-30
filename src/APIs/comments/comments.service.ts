import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { DataSource, EntityManager, UpdateResult } from 'typeorm';
import { Posts } from '../posts/entities/posts.entity';
import {
  ChildrenComment,
  FetchCommentDto,
  FetchCommentsDto,
} from './dtos/fetch-comments.dto';
import {
  ICommentsServiceDelete,
  ICommentsServiceFetch,
  ICommentsServiceId,
  ICommentsServicePatch,
  ICommentsServicePostsIdValidCheck,
} from './interfaces/comments.service.interface';
import { Comment } from './entities/comment.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotType } from 'src/common/enums/not-type.enum';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) {}

  async postsIdValidCheck({
    parentId,
    postsId,
  }: ICommentsServicePostsIdValidCheck): Promise<void> {
    const parent = await this.existCheck({ id: parentId });
    if (parent.postsId != postsId)
      throw new BadRequestException(
        '게시글 아이디가 루트 댓글이 작성된 게시글 아이디와 일치하지 않습니다.',
      );
    if (parent.parentId)
      throw new BadRequestException('부모 댓글이 루트 댓글이 아닙니다.');
  }

  async existCheck({ id }: ICommentsServiceId): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(
        '댓글의 아이디를 찾을 수 없습니다. 존재하지 않거나 이미 삭제되었습니다.',
      );
    }
    return comment;
  }

  async insert(createCommentDto: CreateCommentDto): Promise<ChildrenComment> {
    const post = await this.dataSource.manager.findOne(Posts, {
      where: { id: createCommentDto.postsId },
    });
    if (post.allow_comment === false)
      throw new ForbiddenException('댓글이 허용되지 않은 게시물 입니다.');
    if (createCommentDto.parentId)
      await this.postsIdValidCheck({
        parentId: createCommentDto.parentId,
        postsId: createCommentDto.postsId,
      });
    await this.dataSource.manager.update(Posts, createCommentDto.postsId, {
      comment_count: () => 'comment_count +1',
    });

    const commentData = await this.commentsRepository.insertComment({
      createCommentDto,
    });
    const { id } = commentData.identifiers[0];
    const { posts, parent, ...result } =
      await this.commentsRepository.fetchCommentWithNotiInfo({ id });

    if (result.parentId && parent.userKakaoId != result.userKakaoId) {
      await this.notificationsService.emitAlarm({
        userKakaoId: result.userKakaoId,
        targetUserKakaoId: parent.userKakaoId,
        type: NotType.REPLY,
        postId: result.postsId,
      });
    }
    // 자신에게 알림 보내는 경우 생략
    if (result.userKakaoId != posts.userKakaoId) {
      await this.notificationsService.emitAlarm({
        userKakaoId: result.userKakaoId,
        targetUserKakaoId: posts.userKakaoId,
        type: NotType.COMMENT,
        postId: result.postsId,
      });
    }

    return result;
  }

  async patchComment({
    kakaoId,
    postsId,
    id,
    content,
  }: ICommentsServicePatch): Promise<FetchCommentDto> {
    const commentData = await this.existCheck({ id });
    if (!commentData) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (commentData.postsId != postsId)
      throw new NotFoundException('루트 게시글의 아이디가 일치하지 않습니다.');
    if (commentData.userKakaoId != kakaoId)
      throw new ForbiddenException('댓글을 수정할 권한이 없습니다.');
    commentData.content = content;
    return await this.commentsRepository.save(commentData);
  }

  async fetchComments({
    postsId,
  }: ICommentsServiceFetch): Promise<FetchCommentsDto[]> {
    return await this.commentsRepository.fetchComments({ postsId });
  }

  async delete({
    id,
    userKakaoId,
    postsId,
  }: ICommentsServiceDelete): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const data = await this.existCheck({ id });
      let childrenData = [];
      let deletedResult: UpdateResult;
      if (data.postsId !== postsId) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }
      if (data.parentId == null)
        childrenData = await manager.find(Comment, {
          where: { parentId: data.id },
        });
      if (childrenData.length == 0) {
        await manager.delete(Comment, { user: { kakaoId: userKakaoId }, id });
        await manager.update(Posts, data.postsId, {
          comment_count: () => 'comment_count - 1',
        });
      } else {
        deletedResult = await manager.softDelete(Comment, {
          user: { kakaoId: userKakaoId },
          id,
        });
        if (deletedResult.affected < 1)
          throw new NotFoundException('삭제할 댓글이 존재하지 않습니다');
      }
    });
  }
}
