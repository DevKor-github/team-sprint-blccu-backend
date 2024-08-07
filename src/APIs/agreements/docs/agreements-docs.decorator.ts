import { MethodNames } from '@/common/types/method';
import { AgreementsController } from '../agreements.controller';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AgreementDto } from '../dtos/common/agreement.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { AgreementsService } from '../agreements.service';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';

type AgreementsEndpoints = MethodNames<AgreementsController>;

const AgreementsDocsMap: Record<AgreementsEndpoints, MethodDecorator[]> = {
  agree: [
    ApiOperation({ summary: '온보딩 동의' }),
    ApiAuthResponse(),
    ApiCreatedResponse({ type: AgreementDto }),
    ApiResponseFromMetadata([
      { service: AgreementsService, methodName: 'createAgreement' },
    ]),
  ],
  fetchAgreements: [
    ApiOperation({ summary: '로그인된 유저의 온보딩 동의 내용들을 fetch' }),
    ApiOkResponse({ type: [AgreementDto] }),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      { service: AgreementsService, methodName: 'findAgreements' },
    ]),
  ],
  fetchAgreementAdmin: [
    ApiTags('어드민 API'),
    ApiOperation({ summary: '[어드민용] 특정 유저의 온보딩 동의 내용을 조회' }),
    ApiAuthResponse(),
    ApiOkResponse({ type: [AgreementDto] }),
    ApiResponseFromMetadata([
      { service: AgreementsService, methodName: 'findAgreements' },
    ]),
  ],
  patchAgreement: [
    ApiOperation({ summary: '동의 여부를 수정' }),
    ApiAuthResponse(),
    ApiOkResponse({ type: AgreementDto }),
    ApiResponseFromMetadata([
      { service: AgreementsService, methodName: 'patchAgreement' },
    ]),
  ],
};

export const AgreementsDocs = applyDocs(AgreementsDocsMap);
