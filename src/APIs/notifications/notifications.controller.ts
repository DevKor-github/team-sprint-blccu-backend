import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { interval, map, merge } from 'rxjs';
import { NotificationsGetResponseDto } from './dtos/response/notifications-get-response.dto';
import { NotificationsGetRequestDto } from './dtos/request/notifications-get-request.dto';
import { NotificationsDocs } from './docs/notifications-docs.decorator';

@NotificationsDocs
@ApiTags('알림 API')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuardV2)
  @Sse('subscribe')
  connectUser(@Req() req: Request, @Res() res: Response) {
    const targetUserId = req.user.userId;
    res.setTimeout(0); // 600초로 설정, 필요에 따라 변경 가능 nginx도 함께 변경할 것.
    const sseStream = this.notificationsService.connectUser({
      targetUserId,
    });
    const pingStream = interval(30000).pipe(
      map(() => ({ type: 'ping', data: 'keep-alive' })),
    );
    return merge(sseStream, pingStream);
  }

  @Get()
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

  @UseGuards(AuthGuardV2)
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
