import type { MethodNames } from '@/common/types/method';

import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '../../../common/decorators/api-response-from-metadata.decorator';
import { applyDocs } from '@/utils/docs.utils';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { LikesService } from '../likes.service';
import { LikesGetResponseDto } from '../dtos/response/likes-get-response.dto';
import { LikesController } from '../likes.controller';
import { UserFollowingResponseDto } from '@/APIs/users/dtos/response/user-following-response.dto';
import { HttpCode } from '@nestjs/common';

type LikesEndpoints = MethodNames<LikesController>;

const LikesDocsMap: Record<LikesEndpoints, MethodDecorator[]> = {
  like: [
    ApiOperation({
      summary: '좋아요',
      description: '로그인 된 유저가 {id}인 게시글에 좋아요를 한다.',
    }),
    ApiAuthResponse(),
    ApiCreatedResponse({
      description: '좋아요 성공',
      type: LikesGetResponseDto,
    }),
    ApiNotFoundResponse({ description: '게시글을 찾을 수 없는 경우' }),
    ApiResponseFromMetadata([{ service: LikesService, methodName: 'like' }]),
  ],
  deleteLike: [
    ApiOperation({
      summary: '좋아요 취소',
      description: '로그인 된 유저가 {id}인 게시글에 좋아요를 취소한다.',
    }),
    ApiAuthResponse(),
    ApiNoContentResponse({
      description: '좋아요 취소 성공',
    }),
    ApiResponseFromMetadata([
      { service: LikesService, methodName: 'cancleLike' },
    ]),
  ],
  fetchIfLiked: [
    ApiOperation({
      summary: '게시글 좋아요 여부 체크',
      description: '특정 게시글에 내가 좋아요를 눌렀는 지 체크',
    }),
    ApiOkResponse({ type: Boolean }),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      { service: LikesService, methodName: 'checkIfLiked' },
    ]),
  ],
  fetchLikes: [
    ApiOperation({
      summary: '좋아요 누른 대상 조회하기',
      description: '게시글에 좋아요를 누른 사람들을 확인한다.',
    }),
    ApiOkResponse({
      description: '조회 성공',
      type: [UserFollowingResponseDto],
    }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: LikesService, methodName: 'findLikes' },
    ]),
  ],
};

export const LikesDocs = applyDocs(LikesDocsMap);
