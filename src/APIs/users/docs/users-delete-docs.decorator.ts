import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { UsersDeleteController } from '../controllers/users-delete.controller';
import { UsersDeleteService } from '../services/users-delete.service';
import { HttpCode } from '@nestjs/common';

type UsersDeleteEndpoints = MethodNames<UsersDeleteController>;

const UsersDeleteDocsMap: Record<UsersDeleteEndpoints, MethodDecorator[]> = {
  deleteUser: [
    ApiOperation({
      summary: '회원 탈퇴(soft delete)',
      description: '회원을 탈퇴하고 연동된 게시글과 댓글을 soft delete한다.',
    }),
    ApiAuthResponse(),
    HttpCode(204),
    ApiNoContentResponse(),
    ApiResponseFromMetadata([
      { service: UsersDeleteService, methodName: 'deleteUser' },
    ]),
  ],
};

export const UsersDeleteDocs = applyDocs(UsersDeleteDocsMap);
