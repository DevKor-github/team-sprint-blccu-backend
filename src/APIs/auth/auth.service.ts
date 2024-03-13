import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { KakaoUserDto } from './dto/kakao-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async getJWT(kakaoUserDto: KakaoUserDto) {
    const user = await this.kakaoValidateUser(kakaoUserDto); // 카카오 정보 검증 및 회원가입 로직
    // const accessToken = this.generateAccessToken(user); // AccessToken 생성
    // const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    // return { accessToken, refreshToken };
  }

  async kakaoValidateUser(kakaoUserDto: KakaoUserDto) {
    let user = await this.usersService.findUserByKakaoId(kakaoUserDto); // 유저 조회
    if (!user) {
      // 회원 가입 로직
      user = await this.usersService.create(kakaoUserDto);
    }
    return user;
  }
}
