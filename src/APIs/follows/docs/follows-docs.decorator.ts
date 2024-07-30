import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { FollowsController } from '../follows.controller';
import { FollowDto } from '../dtos/common/follow.dto';
import { FollowsService } from '../follows.service';
import { HttpCode } from '@nestjs/common';
import { UserFollowingResponseDto } from '@/APIs/users/dtos/response/user-following-response.dto';

type FollowsEndpoints = MethodNames<FollowsController>;

const FollowsDocsMap: Record<FollowsEndpoints, MethodDecorator[]> = {
  followUser: [
    ApiOperation({
      summary: '팔로우 추가하기',
      description: '로그인된 유저가 userId를 팔로우한다.',
    }),
    ApiAuthResponse(),
    HttpCode(201),
    ApiCreatedResponse({ description: '이웃 추가 성공', type: FollowDto }),
    ApiResponseFromMetadata([
      { service: FollowsService, methodName: 'followUser' },
    ]),
  ],
  unfollowUser: [
    ApiOperation({
      summary: '팔로우 삭제하기',
      description: '로그인된 유저가 userId를 언팔로우 한다.',
    }),
    ApiAuthResponse(),
    ApiNoContentResponse({ description: '언팔로우 성공' }),
    HttpCode(204),
    ApiResponseFromMetadata([
      { service: FollowsService, methodName: 'unfollowUser' },
    ]),
  ],
  checkFollower: [
    ApiOperation({
      summary: '팔로워 유무 조회',
      description: '나와 팔로우되었는지 유무 체크를 한다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: Boolean }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: FollowsService, methodName: 'existCheckWithoutValidation' },
    ]),
  ],
  checkFollowing: [
    ApiOperation({
      summary: '팔로잉 유무 조회',
      description: '나의 팔로잉인지 유무 체크를 한다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: Boolean }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: FollowsService, methodName: 'existCheckWithoutValidation' },
    ]),
  ],
  getFollowers: [
    ApiOperation({
      summary: '팔로워 목록 조회',
      description: 'userId의 팔로워 목록을 조회한다.',
    }),
    ApiOkResponse({
      description: '팔로워 목록 조회 성공',
      type: [UserFollowingResponseDto],
    }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: FollowsService, methodName: 'findFollowers' },
    ]),
  ],
  getFollows: [
    ApiOperation({
      summary: '팔로잉 목록 조회',
      description: 'userId의 팔로잉 목록을 조회한다.',
    }),
    ApiOkResponse({
      description: '팔로잉 목록 조회 성공',
      type: [UserFollowingResponseDto],
    }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: FollowsService, methodName: 'findFollowings' },
    ]),
  ],
};

export const FollowsDocs = applyDocs(FollowsDocsMap);
