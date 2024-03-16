import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { KakaoUserDto } from './dto/kakao-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async getJWT(kakaoUserDto: KakaoUserDto) {
    const user = await this.kakaoValidateUser(kakaoUserDto); // 카카오 정보 검증 및 회원가입 로직
    console.log('[AUTHSERVICE] user:', user);
    const accessToken = this.generateAccessToken(user); // AccessToken 생성
    const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    return { accessToken, refreshToken };
  }

  async kakaoValidateUser(kakaoUserDto: KakaoUserDto) {
    let user = await this.usersService.findUserByKakaoId(kakaoUserDto); // 유저 조회
    if (!user) {
      // 회원 가입 로직
      user = await this.usersService.create(kakaoUserDto);
    }
    return user;
  }

  generateAccessToken(kakaoUserDto: KakaoUserDto) {
    const payload = { userId: kakaoUserDto.kakaoId };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(kakaoUserDto: KakaoUserDto) {
    const payload = { userId: kakaoUserDto.kakaoId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    const saltOrRounds = 10;
    const current_refresh_token = await bcrypt.hash(refreshToken, saltOrRounds);

    await this.usersService.setCurrentRefreshToken({
      kakaoId: payload.userId,
      current_refresh_token,
    });
    return refreshToken;
  }
  async refresh(refreshToken: string): Promise<string> {
    try {
      // 1차 검증
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const kakaoId = decodedRefreshToken.userId;

      // 데이터베이스에서 User 객체 가져오기
      const user = await this.usersService.findUserByKakaoIdWithToken(kakaoId);

      // 2차 검증
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.current_refresh_token,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid refresh-token');
      }

      // 새로운 accessToken 생성
      const accessToken = this.generateAccessToken(user);

      return accessToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
