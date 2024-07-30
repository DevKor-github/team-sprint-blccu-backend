import type { MethodNames } from '@/common/types/method';

import {
  ApiCreatedResponse,
  ApiMovedPermanentlyResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '../../../common/decorators/api-response-from-metadata.decorator';
import { AuthController } from '@/APIs/auth/auth.controller';
import { AuthService } from '@/APIs/auth/auth.service';
import { HttpCode } from '@nestjs/common';
import { applyDocs } from '@/utils/docs.utils';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';

type AuthEndpoints = MethodNames<AuthController>;

const AuthDocsMap: Record<AuthEndpoints, MethodDecorator[]> = {
  kakaoLogin: [
    ApiOperation({
      summary: '카카오 로그인',
      description:
        '[swagger 불가능, url 직접 이동] 카카오 서버에 로그인을 요청한다. 응답으로 도착한 kakaoId를 기반으로 jwt accessToken과 refreshToken을 클라이언트에게 쿠키로 전송한다',
    }),
    ApiMovedPermanentlyResponse({
      description: `카카오에서 인증 완료 후 클라이언트 루트 url로 리다이렉트 한다.`,
    }),
    ApiResponseFromMetadata([{ service: AuthService, methodName: 'getJWT' }]),
    HttpCode(301),
  ],
  refresh: [
    ApiOperation({
      summary: 'accessToken refresh',
      description: 'refreshToken을 기반으로 accessToken을 재발급한다.',
    }),
    ApiCreatedResponse({
      description: 'accessToken 쿠키를 새로 발급한다.',
    }),
    ApiUnauthorizedResponse({
      description:
        'refresh 토큰이 만료되었거나 없을 경우 cookie를 모두 clear한다.',
    }),
    ApiAuthResponse(),
    HttpCode(201),
    ApiResponseFromMetadata([{ service: AuthService, methodName: 'refresh' }]),
  ],
  logout: [
    ApiOperation({
      summary: '로그아웃(clear cookie)',
      description: '클라이언트의 로그인 관련 쿠키를 초기화한다.',
    }),
    ApiAuthResponse(),
    HttpCode(204),
  ],
};

export const AuthDocs = applyDocs(AuthDocsMap);
