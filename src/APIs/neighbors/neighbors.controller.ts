import {
  Controller,
  Get,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NeighborsService } from './neighbors.service';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('이웃 API')
@Controller('neighbor')
export class NeighborsController {
  constructor(private readonly neighborsService: NeighborsService) {}

  @ApiOperation({
    summary: '이웃 추가하기',
    description: '로그인된 유저가 follow_id를 팔로우한다.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiCreatedResponse({ description: '이웃 추가 성공' })
  @ApiConflictResponse({ description: '이미 팔로우한 상태이다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('follow/:follow_id')
  @HttpCode(201)
  followUser(@Param('follow_id') follow_id: number, @Req() req: Request) {
    const kakaoId = parseInt(req.user.userId);
    return this.neighborsService.followUser({
      from_user: kakaoId,
      to_user: follow_id,
    });
  }

  //post로 바꾸삼
  @ApiOperation({
    summary: '이웃 삭제하기',
    description: '로그인된 유저가 follow_id를 언팔로우 한다.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({ description: '언팔로우 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 이웃 정보이다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('unfollow/:follow_id')
  @HttpCode(200)
  unfollowUser(@Param('follow_id') follow_id: number, @Req() req: Request) {
    const kakaoId = parseInt(req.user.userId);
    return this.neighborsService.unfollowUser({
      from_user: kakaoId,
      to_user: follow_id,
    });
  }

  @ApiOperation({
    summary: '팔로워 목록 조회',
    description: 'id의 팔로워 목록을 조회한다.',
  })
  @ApiOkResponse({ description: '팔로워 목록 조회 성공' })
  @HttpCode(200)
  @Get('followers/:id')
  getFollowers(@Param('id') kakaoId: number) {
    return this.neighborsService.getFollowers({ kakaoId });
  }

  @ApiOperation({
    summary: '팔로우 목록 조회',
    description: 'id의 팔로우 목록을 조회한다.',
  })
  @ApiOkResponse({ description: '팔로우 목록 조회 성공' })
  @HttpCode(200)
  @Get('follows/:id')
  getFollows(@Param('id') kakaoId: number) {
    return this.neighborsService.getFollows({ kakaoId });
  }
}
