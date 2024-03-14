import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('kakao/:kakaoId')
  findUserByKakaoId(@Param('kakaoId') kakaoId: number) {
    return this.usersService.findUserByKakaoId({ kakaoId });
  }
}
