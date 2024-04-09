import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @Get('/jwtTest')
  // get(@Req() req: Request) {
  //   console.log(req.user.userId);
  //   return 'JWT 인증 성공';
  // }
}
