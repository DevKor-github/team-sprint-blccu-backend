import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtCheckStrategy extends PassportStrategy(Strategy, 'jwt-check') {
  // controller에 요청이 왔을 때 constructor가 실행
  constructor(private readonly configService: ConfigService) {
    super({
      // accessToken 위치
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          try {
            // const accessToken = request.cookies?.accessToken;
            // console.log(accessToken);
            return null;
          } catch (e) {
            // throw new UnauthorizedException(e.message);
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      failWithError: false,
    });
  }

  async validate(payload) {
    return null;
    return { message: 'Authentication failed' };
    return { userId: payload.userId };
  }
}
