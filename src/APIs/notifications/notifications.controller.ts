import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
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
import { Request } from 'express';
import { EmitNotInput } from './dtos/emit-not.dto';

import { AuthGuardV2 } from 'src/commons/guards/auth.guard';
import { FetchNotiInput, FetchNotiResponse } from './dtos/fetch-noti.dto';

@ApiTags('알림 API')
@Controller('nots')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /*
  로직: 유저가 접속하면 알림을 구독한다.
  최초 구독 시 알림을 한번 fetch 한다. getManyAndCount로 개수 체크해서 메인에 띄워줌
  댓글을 달거나 등 알림이 생기면 kakaoId 옵저버에 next로 이벤트 갱신해준다.
  갱신이 발생하면 sub해둔 프론트가 refetching을 한다.
  브라우저를 끄거나 refetching이 한동안 일어나지 않으면 sse를 끊는다.
  */
  @ApiOperation({
    summary: '[SSE] kakaoId로 오는 알림을 구독한다.',
    description:
      '[swagger 불가능, postman 권장] sse를 연결한다. 로그인된 유저를 타겟으로 하는 알림이 보내졌을경우 sse를 통해 전달받는다.',
  })
  @ApiCookieAuth()
  @ApiProduces('text/event-stream')
  @UseGuards(AuthGuardV2)
  @Sse('sub')
  sendClientAlarm(
    @Req() req: Request,
    // @Param('kakaoId') userKakaoId,
  ) {
    const userKakaoId = req.user.userId;
    const sseStream = this.notificationsService.connectUser(userKakaoId);
    return sseStream;
  }

  @ApiOperation({
    summary: '알림 조회',
    description:
      '로그인된 유저들에게 보내진 알림들을 조회한다. query를 통해 알림 조회 옵션 설정. sse 연결 이전 이니셜 데이터 fetch 시 사용',
  })
  @ApiOkResponse({ type: [FetchNotiResponse] })
  @Get('init')
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
    summary: '알림 토글',
    description: '알림을 읽음 처리한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @ApiOkResponse({ type: FetchNotiResponse })
  @HttpCode(200)
  @Post('toggle/:id')
  async toggleNoti(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<FetchNotiResponse> {
    const targetUserKakaoId = req.user.userId;
    return await this.notificationsService.toggle({ id, targetUserKakaoId });
  }

  @ApiOperation({
    summary: 'kakaoId에게 알림 생성',
    description:
      'kakaoId에게 알림을 보낸다. sse로 연결되어 있을 경우 실시간으로 fetch된다.',
  })
  @Post('send/:kakaoId')
  sendNoti(@Req() req: Request, @Body() body: EmitNotInput) {
    const userKakaoId = req.user.userId;
    this.notificationsService.emitAlarm({ userKakaoId, ...body });
  }
}
