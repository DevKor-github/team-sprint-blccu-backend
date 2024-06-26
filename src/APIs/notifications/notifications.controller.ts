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
import { FetchNotiInput, FetchNotiResponse } from './dtos/fetch-noti.dto';
import { interval, map, merge } from 'rxjs';

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
    const targetUserKakaoId = req.user.userId;
    res.setTimeout(60 * 10000); // 600초로 설정, 필요에 따라 변경 가능 nginx도 함께 변경할 것.

    const sseStream = this.notificationsService.connectUser({
      targetUserKakaoId,
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
  @ApiOkResponse({ type: [FetchNotiResponse] })
  @Get()
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  async fetchNoti(
    @Req() req: Request,
    @Query() fetchNotiInput: FetchNotiInput,
  ): Promise<FetchNotiResponse[]> {
    const kakaoId = req.user.userId;
    return await this.notificationsService.fetch({
      kakaoId,
      ...fetchNotiInput,
    });
  }

  @ApiOperation({
    summary: '알림 읽기',
    description: '알림을 읽음 처리한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @ApiOkResponse({ type: FetchNotiResponse })
  @HttpCode(200)
  @Post(':id/read')
  async readNoti(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<FetchNotiResponse> {
    const targetUserKakaoId = req.user.userId;
    return await this.notificationsService.read({ id, targetUserKakaoId });
  }
}
