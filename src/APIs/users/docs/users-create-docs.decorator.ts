import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { ApiOperation } from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { UsersCreateController } from '../controllers/users-create.controller';

type UsersCreateEndpoints = MethodNames<UsersCreateController>;

const UsersCreateDocsMap: Record<UsersCreateEndpoints, MethodDecorator[]> = {};

export const UsersCreateDocs = applyDocs(UsersCreateDocsMap);
