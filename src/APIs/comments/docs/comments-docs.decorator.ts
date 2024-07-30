import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { CommentsController } from '../comments.controller';
import { CommentChildrenDto } from '../dtos/common/comment-children.dto';
import { CommentsService } from '../comments.service';
import { HttpCode } from '@nestjs/common';
import { CommentsGetResponseDto } from '../dtos/response/comments-get-response.dto';
import { CommentDto } from '../dtos/common/comment.dto';

type CommentsEndpoints = MethodNames<CommentsController>;

const CommentsDocsMap: Record<CommentsEndpoints, MethodDecorator[]> = {
  createComment: [
    ApiTags('게시글 API'),
    ApiOperation({
      summary: '댓글을 작성한다.',
      description: '댓글을 작성한다.',
    }),
    ApiCreatedResponse({ type: CommentChildrenDto }),
    ApiAuthResponse(),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: CommentsService, methodName: 'createComment' },
    ]),
  ],
  fetchComments: [
    ApiTags('게시글 API'),
    ApiOperation({
      summary: '특정 게시글에 대한 댓글 조회',
    }),
    ApiOkResponse({ type: [CommentsGetResponseDto] }),
    ApiResponseFromMetadata([
      { service: CommentsService, methodName: 'fetchComments' },
    ]),
  ],
  fetchUserComments: [
    ApiTags('유저 API'),
    ApiOperation({
      summary: '자신의 최근 댓글 10개 조회',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: [CommentDto] }),
    ApiResponseFromMetadata([
      { service: CommentsService, methodName: 'fetchUserComments' },
    ]),
  ],
  patchComment: [
    ApiTags('게시글 API'),
    ApiOperation({ summary: '특정 게시글에 대한 댓글 수정' }),
    ApiOkResponse({ type: CommentDto }),
    ApiResponseFromMetadata([
      { service: CommentsService, methodName: 'patchComment' },
    ]),
  ],
  deleteComment: [
    ApiTags('게시글 API'),
    ApiOperation({
      summary: '댓글을 삭제한다.',
      description: '댓글을 논리삭제한다. date_deleted 칼럼에 값이 생긴다.',
    }),
    ApiAuthResponse(),
    ApiNoContentResponse({ description: '삭제 성공' }),
    HttpCode(205),
    ApiResponseFromMetadata([
      { service: CommentsService, methodName: 'delete' },
    ]),
  ],
};

export const CommentsDocs = applyDocs(CommentsDocsMap);
