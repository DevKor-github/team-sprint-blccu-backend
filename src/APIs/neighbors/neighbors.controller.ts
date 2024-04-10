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
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FollowDto } from './dtos/follow.dto';
import { FromUserResponseDto } from './dtos/from-user-response.dto';
import { ToUserResponseDto } from './dtos/to-user-response.dto';
import { FollowUserDto } from './dtos/follow-user.dto';

@ApiTags('이웃 API')
@Controller('neighbors')
export class NeighborsController {
  constructor(private readonly neighborsService: NeighborsService) {}

  @ApiOperation({
    summary: '이웃 추가하기',
    description: '로그인된 유저가 follow_id를 팔로우한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ description: '이웃 추가 성공', type: FollowUserDto })
  @ApiConflictResponse({ description: '이미 팔로우한 상태이다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post('follow')
  @HttpCode(201)
  async followUser(
    @Body() body: FollowDto,
    @Req() req: Request,
  ): Promise<FollowUserDto> {
    const kakaoId = parseInt(req.user.userId);
    const to_user = body.follow_id;
    return await this.neighborsService.followUser({
      from_user: kakaoId,
      to_user,
    });
  }

  @ApiOperation({
    summary: '이웃 삭제하기',
    description: '로그인된 유저가 follow_id를 언팔로우 한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ description: '언팔로우 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 이웃 정보이다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post('unfollow')
  @HttpCode(200)
  unfollowUser(@Body() body: FollowDto, @Req() req: Request) {
    const kakaoId = parseInt(req.user.userId);
    const to_user = body.follow_id;
    return this.neighborsService.unfollowUser({
      from_user: kakaoId,
      to_user,
    });
  }

  @ApiOperation({
    summary: '팔로워 목록 조회',
    description: 'id의 팔로워 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '팔로워 목록 조회 성공',
    type: [FromUserResponseDto],
  })
  @HttpCode(200)
  @Get('followers/:id')
  getFollowers(@Param('id') kakaoId: number): Promise<FromUserResponseDto[]> {
    return this.neighborsService.getFollowers({ kakaoId });
  }

  @ApiOperation({
    summary: '팔로우 목록 조회',
    description: 'id의 팔로우 목록을 조회한다.',
  })
  @ApiOkResponse({
    description: '팔로우 목록 조회 성공',
    type: [ToUserResponseDto],
  })
  @HttpCode(200)
  @Get('follows/:id')
  getFollows(@Param('id') kakaoId: number): Promise<ToUserResponseDto[]> {
    return this.neighborsService.getFollows({ kakaoId });
  }
}
