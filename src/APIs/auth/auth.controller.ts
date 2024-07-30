import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { AuthDocs } from './docs/auth-docs.decorator';
import { BlccuException } from '@/common/blccu-exception';

@ApiTags('인증 API')
@Controller('auth')
@AuthDocs
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/kakao') // 카카오 서버를 거쳐서 도착하게 될 엔드포인트
  @UseGuards(AuthGuard('kakao')) // kakao.strategy를 실행시켜 줍니다.
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.getJWT({
      userId: req.user.kakaoId,
    });

    // 클라이언트 도메인 설정
    const clientDomain = process.env.CLIENT_DOMAIN;
    const oneDay = 24 * 60 * 60 * 1000; // 하루(밀리초)
    const accessExpiryDate = new Date(Date.now() + oneDay);
    const refreshExpiryDate = new Date(Date.now() + oneDay * 30);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
      expires: accessExpiryDate,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
      expires: refreshExpiryDate,
    });

    return res.redirect(process.env.CLIENT_URL);
  }

  @Get('refresh-token')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies.refreshToken,
      );
      const clientDomain = process.env.CLIENT_DOMAIN;
      const oneDay = 24 * 60 * 60 * 1000; // 하루(밀리초)
      const accessExpiryDate = new Date(Date.now() + oneDay);

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        domain: clientDomain,
        sameSite: 'none',
        secure: true,
        expires: accessExpiryDate,
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

      throw new BlccuException('INVALID_REFRESH_TOKEN');
    }
  }

  @UseGuards(AuthGuardV2)
  @Post('logout')
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
