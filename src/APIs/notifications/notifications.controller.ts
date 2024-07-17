import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { interval, map, merge } from 'rxjs';
import { NotificationsGetResponseDto } from './dtos/response/notifications-get-response.dto';
import { NotificationsGetRequestDto } from './dtos/request/notifications-get-request.dto';

@ApiTags('알림 API')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({
    summary: '[SSE] 알림을 구독한다.',
    description:
      '[swagger 불가능, postman 권장] sse를 연결한다. 로그인된 유저를 타겟으로 하는 알림이 보내졌을경우 sse를 통해 전달받는다.',
  })
  @ApiCookieAuth()
  @ApiProduces('text/event-stream')
  @UseGuards(AuthGuardV2)
  @Sse('subscribe')
  connectUser(@Req() req: Request, @Res() res: Response) {
    const targetUserId = req.user.userId;
    res.setTimeout(0); // 600초로 설정, 필요에 따라 변경 가능 nginx도 함께 변경할 것.
    // res.setTimeout(15 * 1000);
    const sseStream = this.notificationsService.connectUser({
      targetUserId,
    });
    const pingStream = interval(30000).pipe(
      map(() => ({ type: 'ping', data: 'keep-alive' })),
    );
    return merge(sseStream, pingStream);
  }

  @ApiOperation({
    summary: '알림 조회',
    description:
      '로그인된 유저들에게 보내진 알림들을 조회한다. query를 통해 알림 조회 옵션 설정. sse 연결 이전 이니셜 데이터 fetch 시 사용',
  })
  @ApiOkResponse({ type: [NotificationsGetResponseDto] })
  @Get()
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  async getNotifications(
    @Req() req: Request,
    @Query() fetchNotiInput: NotificationsGetRequestDto,
  ): Promise<NotificationsGetResponseDto[]> {
    const userId = req.user.userId;
    return await this.notificationsService.findNotifications({
      userId,
      ...fetchNotiInput,
    });
  }

  @ApiOperation({
    summary: '알림 읽기',
    description: '알림을 읽음 처리한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @ApiOkResponse({ type: NotificationsGetResponseDto })
  @HttpCode(200)
  @Post(':notificationId/read')
  async readNotification(
    @Req() req: Request,
    @Param('notificationId') notificationId: number,
  ): Promise<NotificationsGetResponseDto> {
    const targetUserId = req.user.userId;
    return await this.notificationsService.readNotification({
      notificationId,
      targetUserId,
    });
  }
}
