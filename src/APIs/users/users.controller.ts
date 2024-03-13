import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findUser({ id });
  }
  @Get('kakao/:kakaoId')
  findUserByKakaoId(@Param('kakaoId') kakaoId: number) {
    return this.usersService.findUserByKakaoId({ kakaoId });
  }
}
