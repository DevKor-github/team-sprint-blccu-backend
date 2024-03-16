import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserResponseDto } from './dto/user-response.dto';
import { PatchUserInput } from './dto/patch-user.input';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 배포 때 삭제!!!!
  @Get('all')
  @ApiOperation({
    summary: '[ONLY FOR DEV] 모든 유저의 정보를 조회한다',
    description: '배포 때 삭제할 거임. 개발 및 테스트용',
  })
  findAllUsers() {
    return this.usersService.getAll();
  }
  // ================================

  @ApiOperation({
    summary: '로그인된 유저의 정보 불러오기',
    description: '로그인된 유저의 정보를 불러온다.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({ description: '불러오기 완료', type: UserResponseDto })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async fetchUser(@Req() req: Request): Promise<UserResponseDto> {
    const kakaoId = req.user.userId;
    return await this.usersService.findUserByKakaoId({ kakaoId });
  }

  @ApiOperation({
    summary: '로그인된 유저의 이름이나 설명을 변경',
    description: '로그인된 유저의 이름이나 설명, 혹은 둘 다를 변경한다.',
  })
  @ApiOkResponse({ description: '변경 성공', type: PatchUserInput })
  @ApiCookieAuth('refreshToken')
  @Patch()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async patchUser(
    @Req() req: Request,
    @Body() body: PatchUserInput,
  ): Promise<UserResponseDto> {
    const kakaoId = req.user.userId;
    const description = body.description;
    const username = body.username;
    return await this.usersService.patchUser({
      kakaoId,
      description,
      username,
    });
  }
}
