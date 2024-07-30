import type { MethodNames } from '@/common/types/method';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '../../../common/decorators/api-response-from-metadata.decorator';
import { applyDocs } from '@/utils/docs.utils';
import { FeedbacksController } from '../feedbacks.controller';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { FeedbackDto } from '../dtos/common/feedback.dto';
import { FeedbacksService } from '../feedbacks.service';

type FeedbacksEndpoints = MethodNames<FeedbacksController>;

const FeedbacksDocsMap: Record<FeedbacksEndpoints, MethodDecorator[]> = {
  createFeedback: [
    ApiOperation({ summary: '피드백 작성하기' }),
    ApiAuthResponse(),
    ApiCreatedResponse({ type: FeedbackDto }),
    ApiResponseFromMetadata([
      { service: FeedbacksService, methodName: 'createFeedback' },
    ]),
  ],
  getFeedbacks: [
    ApiTags('어드민 API'),
    ApiOperation({ summary: '[어드민용] 피드백 내용 조회' }),
    ApiAuthResponse(),
    ApiOkResponse({ type: [FeedbackDto] }),
    ApiResponseFromMetadata([
      { service: FeedbacksService, methodName: 'fetchFeedbacks' },
    ]),
  ],
};

export const FeedbacksDocs = applyDocs(FeedbacksDocsMap);
