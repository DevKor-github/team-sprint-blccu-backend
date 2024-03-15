import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NeighborsService } from './neighbors.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('이웃 API')
@Controller('neighbors')
export class NeighborsController {
  constructor(private readonly neighborsService: NeighborsService) {}

  @ApiOperation({
    summary: '이웃 추가하기',
    description: '로그인된 유저가 follow_id를 팔로우한다.',
  })
  @ApiBody({
    description: '팔로우 할 유저의 kakaoId',
    type: Number,
  })
  @ApiCookieAuth('refreshToken')
  @ApiCreatedResponse({ description: '이웃 추가 성공' })
  @ApiConflictResponse({ description: '이미 팔로우한 상태이다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post('follow')
  @HttpCode(201)
  followUser(@Body('follow_id') follow_id: number, @Req() req: Request) {
    const kakaoId = parseInt(req.user.userId);
    return this.neighborsService.followUser({
      from_user: kakaoId,
      to_user: follow_id,
    });
  }

  @ApiOperation({
    summary: '이웃 삭제하기',
    description: '로그인된 유저가 follow_id를 언팔로우 한다.',
  })
  @ApiBody({
    description: '언팔로우 할 유저의 kakaoId',
    type: Number,
  })
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({ description: '언팔로우 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 이웃 정보이다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post('unfollow/:follow_id')
  @HttpCode(200)
  unfollowUser(@Body('unfollow_id') unfollow_id: number, @Req() req: Request) {
    const kakaoId = parseInt(req.user.userId);
    return this.neighborsService.unfollowUser({
      from_user: kakaoId,
      to_user: unfollow_id,
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
