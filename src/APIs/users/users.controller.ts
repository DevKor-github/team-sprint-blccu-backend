import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '로그인된 유저의 정보 불러오기',
    description: '로그인된 유저의 정보를 불러온다.',
  })
  @ApiCookieAuth('refreshToken')
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchUser(@Req() req: Request) {
    const kakaoId = req.user.userId;
    return await this.usersService.findUserByKakaoId({ kakaoId });
  }

  @Get('kakao/:kakaoId')
  findUserByKakaoId(@Param('kakaoId') kakaoId: number) {
    return this.usersService.findUserByKakaoId({ kakaoId });
  }
}
