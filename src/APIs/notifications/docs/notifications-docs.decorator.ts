import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { ApiOkResponse, ApiOperation, ApiProduces } from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { HttpCode } from '@nestjs/common';
import { NotificationsController } from '../notifications.controller';
import { NotificationsService } from '../notifications.service';
import { NotificationsGetResponseDto } from '../dtos/response/notifications-get-response.dto';

type NotificationsEndpoints = MethodNames<NotificationsController>;

const NotificationsDocsMap: Record<NotificationsEndpoints, MethodDecorator[]> =
  {
    connectUser: [
      ApiOperation({
        summary: '[SSE] 알림을 구독한다.',
        description:
          '[swagger 지원 x] sse를 연결한다. 로그인된 유저를 타겟으로 하는 알림이 보내졌을경우 sse를 통해 전달받는다.',
      }),
      ApiAuthResponse(),
      ApiProduces('text/event-stream'),
      ApiResponseFromMetadata([
        { service: NotificationsService, methodName: 'connectUser' },
      ]),
    ],
    getNotifications: [
      ApiOperation({
        summary: '알림 조회',
        description:
          '로그인된 유저들에게 보내진 알림들을 조회한다. query를 통해 알림 조회 옵션 설정. sse 연결 이전 이니셜 데이터 fetch 시 사용',
      }),
      ApiOkResponse({ type: [NotificationsGetResponseDto] }),
      ApiAuthResponse(),
      ApiResponseFromMetadata([
        { service: NotificationsService, methodName: 'findNotifications' },
      ]),
    ],
    readNotification: [
      ApiOperation({
        summary: '알림 읽기',
        description: '알림을 읽음 처리한다.',
      }),
      ApiOkResponse({ type: NotificationsGetResponseDto }),
      HttpCode(200),
      ApiResponseFromMetadata([
        { service: NotificationsService, methodName: 'readNotification' },
      ]),
    ],
  };

export const NotificationsDocs = applyDocs(NotificationsDocsMap);
