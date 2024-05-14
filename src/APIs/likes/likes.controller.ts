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
import { FetchLikeDto } from './dtos/toggle-like-response.dto';
import { Likes } from './entities/like.entity';
import { FetchLikesResponseDto } from './dtos/fetch-likes-response.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { FetchLikeResponseDto } from './dtos/fetch-likes.dto';

@ApiTags('게시글 API')
@Controller('posts/:postId/like')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: '좋아요',
    description: '로그인 된 유저가 {id}인 게시글에 좋아요를 한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: '좋아요 성공',
    type: FetchLikeResponseDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없는 경우' })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  @Post()
  async like(
    @Param('postId') id: number,
    @Req() req: Request,
  ): Promise<FetchLikeResponseDto> {
    const kakaoId = req.user.userId;
    return await this.likesService.like({ id, kakaoId });
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
  @Delete()
  async deleteLike(
    @Param('postId') id: number,
    @Req() req: Request,
  ): Promise<void> {
    const kakaoId = req.user.userId;
    await this.likesService.cancel_like({ id, kakaoId });
    return;
  }

  @ApiOperation({
    summary: '게시글 좋아요 여부 체크',
    description: '특정 게시글에 내가 좋아요를 눌렀는 지 체크',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: Boolean })
  @UseGuards(AuthGuardV2)
  @Get()
  async fetchIfLiked(
    @Param('postId') id: number,
    @Req() req: Request,
  ): Promise<boolean> {
    const kakaoId = req.user.userId;
    return await this.likesService.fetchIfLiked({ kakaoId, id });
  }

  @ApiOperation({
    summary: '좋아요 누른 대상 조회하기',
    description: '게시글에 좋아요를 누른 사람들을 확인한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: [FetchLikesResponseDto] })
  @HttpCode(200)
  @Get('like-users')
  async fetchLikes(@Param('postId') id: number): Promise<Likes[]> {
    return await this.likesService.fetchLikes({ id });
  }
}
