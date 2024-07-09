import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // controller에 요청이 왔을 때 constructor가 실행
  constructor(private readonly svc_config: ConfigService) {
    super({
      // accessToken 위치
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          try {
            return request.cookies.accessToken;
          } catch (e) {
            throw new UnauthorizedException(e.message);
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: svc_config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload) {
    return { userId: payload.userId };
  }
}
