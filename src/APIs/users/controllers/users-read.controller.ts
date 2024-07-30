import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersReadService } from '../services/users-read.service';
import { UserFollowingResponseDto } from '../dtos/response/user-following-response.dto';
import { Request } from 'express';
import { UserDto } from '../dtos/common/user.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { UsersReadDocs } from '../docs/users-read-docs.decorator';

@UsersReadDocs
@ApiTags('유저 API')
@Controller('users')
export class UsersReadController {
  constructor(private readonly svc_usersRead: UsersReadService) {}

  @Get('username/:username')
  async getUsersByName(
    @Req() req: Request,
    @Param('username') username: string,
  ): Promise<UserFollowingResponseDto[]> {
    const userId = req.user.userId;
    return await this.svc_usersRead.findUsersByName({ userId, username });
  }

  @Get('profile/id/:userId')
  async getUserById(@Param('userId') userId: number): Promise<UserDto> {
    return await this.svc_usersRead.findUserById({ userId });
  }

  @Get('profile/handle/:handle')
  async getUserByHandle(@Param('handle') handle: string): Promise<UserDto> {
    return await this.svc_usersRead.findUserByHandle({ handle });
  }

  @Get('me')
  @UseGuards(AuthGuardV2)
  async getMyProfile(@Req() req: Request): Promise<UserDto> {
    const userId = req.user.userId;
    return await this.svc_usersRead.findUserById({ userId });
  }
}
