import { Controller, Get, Param, Req, Sse } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

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
    description: '[swagger 불가능, postman 권장]',
  })
  @Sse('sub/:kakaoId')
  sendClientAlarm(@Param('kakaoId') kakaoId: number, @Req() req: Request) {
    // this.notificationsService.addStream(this.users$, this.observer, userId);
    // req.on('close', () =>
    //   this.notificationsService.removeStream(req['user'].id.toString()),
    // );
    // return this.notificationsService.sendClientAlarm(+kakaoId);
  }

  @Get('send/:kakaoId')
  test(@Param('kakaoId') kakaoId: number) {
    // this.notificationsService.emitAlarm(kakaoId);
  }
}
