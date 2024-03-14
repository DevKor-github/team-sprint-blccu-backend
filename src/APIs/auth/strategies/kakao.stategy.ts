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
      const userData = _json.properties;
      const user = {
        kakaoId: _json.id,
        username: userData.nickname,
        profile_image: userData.profile_image,
      };
      // 프로필 이미지 비동의 시 기본값 설정해주기!
      if (!userData.profile_image) {
        user.profile_image = '';
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
