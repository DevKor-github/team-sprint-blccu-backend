import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { FollowsService } from './follows.service';
import { FollowDto } from './dtos/common/follow.dto';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { FollowsDocs } from './docs/follows-docs.decorator';

@FollowsDocs
@ApiTags('유저 API')
@Controller('users')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(AuthGuardV2)
  @Post(':userId/follow')
  async followUser(
    @Req() req: Request,
    @Param('userId') toUser: number,
  ): Promise<FollowDto> {
    const userId = parseInt(req.user.userId);
    return await this.followsService.followUser({
      fromUser: userId,
      toUser,
    });
  }

  @UseGuards(AuthGuardV2)
  @Delete(':userId/follow')
  unfollowUser(
    @Req() req: Request,
    @Param('userId') toUser: number,
  ): Promise<void> {
    const userId = parseInt(req.user.userId);
    return this.followsService.unfollowUser({
      fromUser: userId,
      toUser,
    });
  }

  @UseGuards(AuthGuardV2)
  @Get('me/follower/:userId')
  async checkFollower(
    @Req() req: Request,
    @Param('userId') toUser: number,
  ): Promise<boolean> {
    const fromUser = req.user.userId;
    return await this.followsService.existCheckWithoutValidation({
      fromUser,
      toUser,
    });
  }

  @UseGuards(AuthGuardV2)
  @Get('me/following/:userId')
  async checkFollowing(
    @Req() req: Request,
    @Param('userId') fromUser: number,
  ): Promise<boolean> {
    const toUser = req.user.userId;
    return await this.followsService.existCheckWithoutValidation({
      fromUser,
      toUser,
    });
  }

  @Get(':userId/followers')
  getFollowers(
    @Req() req: Request,
    @Param('userId') userId: number,
  ): Promise<UserFollowingResponseDto[]> {
    const loggedUser = req.user.userId;
    return this.followsService.findFollowers({ userId, loggedUser });
  }

  @Get(':userId/followings')
  getFollows(
    @Req() req: Request,
    @Param('userId') userId: number,
  ): Promise<UserFollowingResponseDto[]> {
    const loggedUser = req.user.userId;
    return this.followsService.findFollowings({ userId, loggedUser });
  }
}
