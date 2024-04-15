import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class KakaoStategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_RESTAPI_KEY,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['profile_image', 'profile_nickname'],
    });
  }
  async validate(
    // POST /oauth/token 요청에 대한 응답이 담깁니다.
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const user = {
        kakaoId: _json.id,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
