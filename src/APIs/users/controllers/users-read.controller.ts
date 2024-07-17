import {
  Controller,
  Get,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersReadService } from '../services/users-read.service';
import { UserFollowingResponseDto } from '../dtos/response/user-following-response.dto';
import { Request } from 'express';
import { UserDto } from '../dtos/common/user.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';

@ApiTags('유저 API')
@Controller('users')
export class UsersReadController {
  constructor(private readonly svc_usersRead: UsersReadService) {}

  @ApiOperation({
    summary: '이름이 포함된 유저 검색',
    description: '이름에 username이 포함된 유저를 검색한다.',
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: [UserFollowingResponseDto],
  })
  @HttpCode(200)
  @Get('username/:username')
  async getUsersByName(
    @Req() req: Request,
    @Param('username') username: string,
  ): Promise<UserFollowingResponseDto[]> {
    const userId = req.user.userId;
    return await this.svc_usersRead.findUsersByName({ userId, username });
  }

  @ApiOperation({
    summary: '특정 유저 프로필 조회(id)',
    description: 'id가 일치하는 유저 프로필을 조회한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: UserDto })
  @HttpCode(200)
  @Get('profile/id/:userId')
  async getUserById(@Param('userId') userId: number): Promise<UserDto> {
    return await this.svc_usersRead.findUserById({ userId });
  }

  @ApiOperation({
    summary: '특정 유저 프로필 조회(handle)',
    description: 'handle이 일치하는 유저 프로필을 조회한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: UserDto })
  @HttpCode(200)
  @Get('profile/handle/:handle')
  async getUserByHandle(@Param('handle') handle: string): Promise<UserDto> {
    return await this.svc_usersRead.findUserByHandle({ handle });
  }

  @ApiOperation({
    summary: '로그인된 유저의 프로필 불러오기',
    description: '로그인된 유저의 프로필을 불러온다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ description: '불러오기 완료', type: UserDto })
  @Get('me')
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  async getMyProfile(@Req() req: Request): Promise<UserDto> {
    const userId = req.user.userId;
    return await this.svc_usersRead.findUserById({ userId });
  }
}
