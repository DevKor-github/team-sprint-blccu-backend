import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { UsersReadController } from '../controllers/users-read.controller';
import { UserFollowingResponseDto } from '../dtos/response/user-following-response.dto';
import { HttpCode } from '@nestjs/common';
import { UsersReadService } from '../services/users-read.service';
import { UserDto } from '../dtos/common/user.dto';

type UsersReadEndpoints = MethodNames<UsersReadController>;

const UsersReadDocsMap: Record<UsersReadEndpoints, MethodDecorator[]> = {
  getUsersByName: [
    ApiOperation({
      summary: '이름이 포함된 유저 검색',
      description: '이름에 username이 포함된 유저를 검색한다.',
    }),
    ApiOkResponse({
      description: '조회 성공',
      type: [UserFollowingResponseDto],
    }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: UsersReadService, methodName: 'findUsersByName' },
    ]),
  ],
  getUserById: [
    ApiOperation({
      summary: '특정 유저 프로필 조회(id)',
      description: 'id가 일치하는 유저 프로필을 조회한다.',
    }),
    ApiOkResponse({ description: '조회 성공', type: UserDto }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: UsersReadService, methodName: 'findUserById' },
    ]),
  ],
  getUserByHandle: [
    ApiOperation({
      summary: '특정 유저 프로필 조회(handle)',
      description: 'handle이 일치하는 유저 프로필을 조회한다.',
    }),
    ApiOkResponse({ description: '조회 성공', type: UserDto }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: UsersReadService, methodName: 'findUserByHandle' },
    ]),
  ],
  getMyProfile: [
    ApiOperation({
      summary: '로그인된 유저의 프로필 불러오기',
      description: '로그인된 유저의 프로필을 불러온다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ description: '불러오기 완료', type: UserDto }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: UsersReadService, methodName: 'findUserById' },
    ]),
  ],
};

export const UsersReadDocs = applyDocs(UsersReadDocsMap);
