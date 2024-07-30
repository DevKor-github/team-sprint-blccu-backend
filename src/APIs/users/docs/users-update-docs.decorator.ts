import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { UsersUpdateController } from '../controllers/users-update.controller';
import { UserDto } from '../dtos/common/user.dto';
import { HttpCode } from '@nestjs/common';
import { UsersUpdateService } from '../services/users-update.service';
import { ImageUploadRequestDto } from '@/modules/images/dtos/image-upload-request.dto';
import { ImageUploadResponseDto } from '@/modules/images/dtos/image-upload-response.dto';

type UsersUpdateEndpoints = MethodNames<UsersUpdateController>;

const UsersUpdateDocsMap: Record<UsersUpdateEndpoints, MethodDecorator[]> = {
  patchUser: [
    ApiOperation({
      summary: '로그인된 유저의 이름이나 설명, 핸들을 변경',
      description: '로그인된 유저의 이름이나 설명, 핸들, 혹은 모두를 변경한다.',
    }),
    ApiOkResponse({ description: '변경 성공', type: UserDto }),
    ApiAuthResponse(),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: UsersUpdateService, methodName: 'updateUser' },
    ]),
  ],
  postProfileImage: [
    ApiOperation({
      summary: '로그인된 유저의 프로필 이미지를 변경',
      description: '스토리지에 프로필 사진을 업로드하고 변경한다.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '업로드 할 파일',
      type: ImageUploadRequestDto,
    }),
    ApiCreatedResponse({
      description: '업로드 성공',
      type: ImageUploadResponseDto,
    }),
    HttpCode(201),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      { service: UsersUpdateService, methodName: 'updateProfileImage' },
    ]),
  ],
  uploadBackgroundImage: [
    ApiOperation({
      summary: '로그인된 유저의 배경 이미지를 변경',
      description: '스토리지에 배경 사진을 업로드하고 변경한다.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '업로드 할 파일',
      type: ImageUploadRequestDto,
    }),
    ApiCreatedResponse({
      description: '업로드 성공',
      type: ImageUploadResponseDto,
    }),
    HttpCode(201),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      { service: UsersUpdateService, methodName: 'updateBackgroundImage' },
    ]),
  ],
};

export const UsersUpdateDocs = applyDocs(UsersUpdateDocsMap);
