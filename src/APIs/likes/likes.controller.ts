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
import { LikesService } from './likes.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { LikesGetResponseDto } from './dtos/response/likes-get-response.dto';

@ApiTags('게시글 API')
@Controller('articles/:articleId')
export class LikesController {
  constructor(private readonly svc_likes: LikesService) {}

  @ApiOperation({
    summary: '좋아요',
    description: '로그인 된 유저가 {id}인 게시글에 좋아요를 한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: '좋아요 성공',
    type: LikesGetResponseDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없는 경우' })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  @Post('like')
  async like(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<LikesGetResponseDto> {
    const userId = req.user.userId;
    return await this.svc_likes.like({ userId, articleId });
  }

  @ApiOperation({
    summary: '좋아요 취소',
    description: '로그인 된 유저가 {id}인 게시글에 좋아요를 취소한다.',
  })
  @ApiCookieAuth()
  @ApiNoContentResponse({
    description: '좋아요 취소 성공',
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없는 경우' })
  @UseGuards(AuthGuardV2)
  @HttpCode(204)
  @Delete('like')
  async deleteLike(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.svc_likes.cancleLike({ articleId, userId });
    return;
  }

  @ApiOperation({
    summary: '게시글 좋아요 여부 체크',
    description: '특정 게시글에 내가 좋아요를 눌렀는 지 체크',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: Boolean })
  @UseGuards(AuthGuardV2)
  @Get('like')
  async fetchIfLiked(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<boolean> {
    const userId = req.user.userId;
    return await this.svc_likes.checkIfLiked({ userId, articleId });
  }

  @ApiOperation({
    summary: '좋아요 누른 대상 조회하기',
    description: '게시글에 좋아요를 누른 사람들을 확인한다.',
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: [UserFollowingResponseDto],
  })
  @HttpCode(200)
  @Get('like-users')
  async fetchLikes(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<UserFollowingResponseDto[]> {
    const userId = req.user.userId;
    return await this.svc_likes.findLikes({ articleId, userId });
  }
}
