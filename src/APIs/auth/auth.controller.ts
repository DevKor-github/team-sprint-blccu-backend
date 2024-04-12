import {
  Controller,
  Get,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiMovedPermanentlyResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('인증 API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '카카오 로그인',
    description:
      '[swagger 불가능, url 직접 이동] 카카오 서버에 로그인을 요청한다. 응답으로 도착한 kakaoId를 기반으로 jwt accessToken과 refreshToken을 클라이언트에게 쿠키로 전송한다',
  })
  @ApiMovedPermanentlyResponse({
    description: `카카오에서 인증 완료 후 클라이언트 루트 url로 리다이렉트 한다.`,
  })
  @Get('kakao') // 카카오 서버를 거쳐서 도착하게 될 엔드포인트
  @UseGuards(AuthGuard('kakao')) // kakao.strategy를 실행시켜 줍니다.
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    // console.log(req.user);
    const { accessToken, refreshToken } = await this.authService.getJWT({
      kakaoId: req.user.kakaoId,
    });
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect(process.env.CLIENT_URL);
  }

  @ApiOperation({
    summary: 'accessToken refresh',
    description: 'refreshToken을 기반으로 accessToken을 재발급한다.',
  })
  @ApiCreatedResponse({
    description: 'accessToken 쿠키를 새로 발급한다.',
  })
  @ApiUnauthorizedResponse({
    description:
      'refresh 토큰이 만료되었거나 없을 경우 cookie를 모두 clear한다.',
  })
  @ApiCookieAuth()
  @Get('refresh')
  @HttpCode(201)
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies.refreshToken,
      );
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
      });
      return res.send();
    } catch (e) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('isLoggedIn');
      throw new UnauthorizedException(e.message);
    }
  }
}

//https://velog.io/@leemhoon00/Nestjs-JWT-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84
