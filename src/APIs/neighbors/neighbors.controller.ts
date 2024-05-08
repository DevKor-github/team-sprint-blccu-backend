import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { NeighborsService } from './neighbors.service';
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
import { FromUserResponseDto } from './dtos/from-user-response.dto';
import { ToUserResponseDto } from './dtos/to-user-response.dto';
import { FollowUserDto } from './dtos/follow-user.dto';
import { AuthGuardV2 } from 'src/commons/guards/auth.guard';

@ApiTags('유저 API')
@Controller('users/:userId')
export class NeighborsController {
  constructor(private readonly neighborsService: NeighborsService) {}

  @ApiOperation({
    summary: '이웃 추가하기',
    description: '로그인된 유저가 userId를 팔로우한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ description: '이웃 추가 성공', type: FollowUserDto })
  @ApiConflictResponse({ description: '이미 팔로우한 상태이다.' })
  @UseGuards(AuthGuardV2)
  @Post('follow')
  @HttpCode(201)
  async followUser(
    @Req() req: Request,
    @Param('userId') to_user: number,
  ): Promise<FollowUserDto> {
    const kakaoId = parseInt(req.user.userId);
    return await this.neighborsService.followUser({
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
  @Post('cancel-follow')
  @HttpCode(204)
  unfollowUser(@Req() req: Request, @Param('userId') to_user: number) {
    const kakaoId = parseInt(req.user.userId);
    return this.neighborsService.unfollowUser({
      from_user: kakaoId,
      to_user,
    });
  }

  @ApiOperation({
    summary: '팔로워 목록 조회',
    description: 'userId의 팔로워 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '팔로워 목록 조회 성공',
    type: [FromUserResponseDto],
  })
  @HttpCode(200)
  @Get('followers')
  getFollowers(
    @Param('userId') kakaoId: number,
  ): Promise<FromUserResponseDto[]> {
    return this.neighborsService.getFollowers({ kakaoId });
  }

  @ApiOperation({
    summary: '팔로잉 목록 조회',
    description: 'userId의 팔로잉 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '팔로잉 목록 조회 성공',
    type: [ToUserResponseDto],
  })
  @HttpCode(200)
  @Get('following')
  getFollows(@Param('userId') kakaoId: number): Promise<ToUserResponseDto[]> {
    return this.neighborsService.getFollows({ kakaoId });
  }
}
