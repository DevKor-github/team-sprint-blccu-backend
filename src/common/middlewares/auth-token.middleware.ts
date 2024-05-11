import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  // token을 decode후 req.user에 붙여서 넘어갑니다.
  // 만약 토큰이 없거나 유효하지 않으면 req.user에는 null 값이 들어갑니다.
  public async use(req: Request, res: Response, next: () => void) {
    const userId = this.verifyUser(req);
    req.user = { userId };
    return next();
  }

  private verifyUser(req: Request): Promise<number> {
    let user = null;
    try {
      const accessToken = req.cookies.accessToken;
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      user = decoded.userId;
    } catch (e) {}

    return user;
  }
}
