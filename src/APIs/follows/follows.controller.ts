import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FollowUserDto } from './dtos/follow-user.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { FollowsService } from './follows.service';
import { UserResponseDtoWithFollowing } from '../users/dtos/user-response.dto';

@ApiTags('유저 API')
@Controller('users')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @ApiOperation({
    summary: '이웃 추가하기',
    description: '로그인된 유저가 userId를 팔로우한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ description: '이웃 추가 성공', type: FollowUserDto })
  @ApiConflictResponse({ description: '이미 팔로우한 상태이다.' })
  @UseGuards(AuthGuardV2)
  @Post(':userId/follow')
  @HttpCode(201)
  async followUser(
    @Req() req: Request,
    @Param('userId') to_user: number,
  ): Promise<FollowUserDto> {
    const kakaoId = parseInt(req.user.userId);
    return await this.followsService.followUser({
      from_user: kakaoId,
      to_user,
    });
  }

  @ApiOperation({
    summary: '이웃 삭제하기',
    description: '로그인된 유저가 userId를 언팔로우 한다.',
  })
  @ApiCookieAuth()
  @ApiNoContentResponse({ description: '언팔로우 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 이웃 정보이다.' })
  @UseGuards(AuthGuardV2)
  @Delete(':userId/follow')
  @HttpCode(204)
  unfollowUser(@Req() req: Request, @Param('userId') to_user: number) {
    const kakaoId = parseInt(req.user.userId);
    return this.followsService.unfollowUser({
      from_user: kakaoId,
      to_user,
    });
  }

  @ApiOperation({
    summary: '팔로워 유무 조회',
    description: '나와 팔로우되었는지 유무 체크를 한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: Boolean })
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  @Get('me/follower/:userId')
  async checkFollower(
    @Req() req: Request,
    @Param('userId') to_user: number,
  ): Promise<boolean> {
    const from_user = req.user.userId;
    return await this.followsService.isExist({ from_user, to_user });
  }

  @ApiOperation({
    summary: '팔로잉 유무 조회',
    description: '나의 팔로잉인지 유무 체크를 한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: Boolean })
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  @Get('me/following/:userId')
  async checkFollowing(
    @Req() req: Request,
    @Param('userId') from_user: number,
  ): Promise<boolean> {
    const to_user = req.user.userId;
    return await this.followsService.isExist({ from_user, to_user });
  }
  @ApiOperation({
    summary: '팔로워 목록 조회',
    description: 'userId의 팔로워 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '팔로워 목록 조회 성공',
    type: [UserResponseDtoWithFollowing],
  })
  @HttpCode(200)
  @Get(':userId/followers')
  getFollowers(
    @Param('userId') kakaoId: number,
  ): Promise<UserResponseDtoWithFollowing[]> {
    return this.followsService.getFollowers({ kakaoId });
  }

  @ApiOperation({
    summary: '팔로잉 목록 조회',
    description: 'userId의 팔로잉 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '팔로잉 목록 조회 성공',
    type: [UserResponseDtoWithFollowing],
  })
  @HttpCode(200)
  @Get(':userId/followings')
  getFollows(
    @Param('userId') kakaoId: number,
  ): Promise<UserResponseDtoWithFollowing[]> {
    return this.followsService.getFollows({ kakaoId });
  }
}
