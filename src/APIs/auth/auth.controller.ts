import {
  Controller,
  Get,
  HttpCode,
  Post,
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
import { AuthGuardV2 } from 'src/common/guards/auth.guard';

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
  @Get('login/kakao') // 카카오 서버를 거쳐서 도착하게 될 엔드포인트
  @UseGuards(AuthGuard('kakao')) // kakao.strategy를 실행시켜 줍니다.
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.getJWT({
      kakaoId: req.user.kakaoId,
    });

    // 클라이언트 도메인 설정
    const clientDomain = process.env.CLIENT_DOMAIN;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('isLoggedIn', true, { httpOnly: false, domain: clientDomain });

    return res.redirect(process.env.CLIENT_URL);
    // return res.send();
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
  @Get('refresh-token')
  @HttpCode(201)
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies.refreshToken,
      );
      const clientDomain = process.env.CLIENT_DOMAIN;

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        domain: clientDomain,
        sameSite: 'none',
        secure: true,
      });
      return res.send();
    } catch (e) {
      const clientDomain = process.env.CLIENT_DOMAIN;

      res.clearCookie('accessToken', {
        httpOnly: true,
        domain: clientDomain,
        sameSite: 'none',
        secure: true,
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        domain: clientDomain,
        sameSite: 'none',
        secure: true,
      });
      res.clearCookie('isLoggedIn', { httpOnly: false, domain: clientDomain });

      throw new UnauthorizedException(e.message);
    }
  }

  @ApiOperation({
    summary: '로그아웃(clear cookie)',
    description: '클라이언트의 로그인 관련 쿠키를 초기화한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Post('logout')
  @HttpCode(204)
  async logout(@Res() res: Response) {
    const clientDomain = process.env.CLIENT_DOMAIN;

    res.clearCookie('accessToken', {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('isLoggedIn', { httpOnly: false, domain: clientDomain });
    return res.send();
  }
}

//https://velog.io/@leemhoon00/Nestjs-JWT-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84
