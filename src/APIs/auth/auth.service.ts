import { Injectable } from '@nestjs/common';
import { KakaoUserDto } from './dtos/common/kakao-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersReadService } from '../users/services/users-read.service';
import { UsersCreateService } from '../users/services/users-create.service';
import { UsersUpdateService } from '../users/services/users-update.service';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly svc_usersRead: UsersReadService,
    private readonly svc_usersCreate: UsersCreateService,
    private readonly svc_usersUpdate: UsersUpdateService,
    private readonly svc_jwt: JwtService,
    private readonly svc_config: ConfigService,
  ) {}

  @MergeExceptionMetadata([
    { service: AuthService, methodName: 'kakaoValidateUser' },
    { service: AuthService, methodName: 'generateAccessToken' },
    { service: AuthService, methodName: 'generateRefreshToken' },
  ])
  async getJWT(kakaoUserDto: KakaoUserDto) {
    const user = await this.kakaoValidateUser(kakaoUserDto); // 카카오 정보 검증 및 회원가입 로직
    const accessToken = this.generateAccessToken({ userId: user.id }); // AccessToken 생성
    const refreshToken = await this.generateRefreshToken({ userId: user.id }); // refreshToken 생성
    return { accessToken, refreshToken };
  }

  @MergeExceptionMetadata([
    { service: UsersReadService, methodName: 'findUserByIdWithDelete' },
    { service: UsersCreateService, methodName: 'createUser' },
    { service: UsersUpdateService, methodName: 'activateUser' },
  ])
  async kakaoValidateUser(kakaoUserDto: KakaoUserDto) {
    let user = await this.svc_usersRead.findUserByIdWithDelete({
      userId: kakaoUserDto.userId,
    }); // 유저 조회
    if (!user) {
      // 회원 가입 로직
      user = await this.svc_usersCreate.createUser({
        userId: kakaoUserDto.userId,
      });
    }
    if (user.dateDeleted != null) {
      await this.svc_usersUpdate.activateUser({
        userId: kakaoUserDto.userId,
      });
    }
    return user;
  }

  generateAccessToken(kakaoUserDto: KakaoUserDto) {
    const payload = { userId: kakaoUserDto.userId };
    return this.svc_jwt.sign(payload);
  }

  @MergeExceptionMetadata([
    { service: UsersUpdateService, methodName: 'setCurrentRefreshToken' },
  ])
  async generateRefreshToken(kakaoUserDto: KakaoUserDto) {
    const payload = { userId: kakaoUserDto.userId };
    const refreshToken = this.svc_jwt.sign(payload, {
      secret: this.svc_config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.svc_config.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    const user = await this.svc_usersUpdate.setCurrentRefreshToken({
      userId: payload.userId,
      currentRefreshToken,
    });
    console.log(user);
    return refreshToken;
  }

  @MergeExceptionMetadata([
    { service: UsersReadService, methodName: 'findUserByIdWithToken' },
  ])
  @ExceptionMetadata([EXCEPTIONS.INVALID_REFRESH_TOKEN])
  async refresh(refreshToken: string): Promise<string> {
    try {
      // 1차 검증
      const decodedRefreshToken = this.svc_jwt.verify(refreshToken, {
        secret: this.svc_config.get('JWT_REFRESH_SECRET'),
      });
      const userId = decodedRefreshToken.userId;

      // 데이터베이스에서 User 객체 가져오기
      const user = await this.svc_usersRead.findUserByIdWithToken({
        userId,
      });
      // 2차 검증
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.currentRefreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new BlccuException('INVALID_REFRESH_TOKEN');
      }

      // 새로운 accessToken 생성
      const accessToken = this.generateAccessToken({ userId });

      return accessToken;
    } catch (err) {
      throw new BlccuException('INVALID_REFRESH_TOKEN');
    }
  }
}
