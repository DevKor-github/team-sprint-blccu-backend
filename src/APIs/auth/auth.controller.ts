import { Controller, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('인증 API')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao') // 카카오 서버를 거쳐서 도착하게 될 엔드포인트
  @UseGuards(AuthGuard('kakao')) // kakao.strategy를 실행시켜 줍니다.
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    // const { accessToken, refreshToken } = await this.authService.getJWT({
    //   kakaoId: req.user.kakaoId,
    //   username: req.user.username,
    //   profile_image: req.user.profile_image,
    // });
    // res.cookie('accessToken', accessToken, { httpOnly: true });
    // res.cookie('refreshToken', refreshToken, { httpOnly: true });
    // res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect(process.env.CLIENT_URL);
  }
}

//https://velog.io/@leemhoon00/Nestjs-JWT-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84
