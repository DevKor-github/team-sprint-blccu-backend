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
import { LikesService } from './likes.service';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ToggleLikeDto } from './dtos/toggle-like.dto';
import { Request } from 'express';
import { ToggleLikeResponseDto } from './dtos/toggle-like-response.dto';
import { Likes } from './entities/like.entity';
import { FetchLikesResponseDto } from './dtos/fetch-likes-response.dto';
import { AuthGuardV2 } from 'src/commons/guards/auth.guard';

@ApiTags('좋아요 API')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: '좋아요 토글하기',
    description: '로그인 된 유저가 {id}인 게시글에 좋아요를 토글한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ description: '토글 성공', type: ToggleLikeResponseDto })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없는 경우' })
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  @Post()
  async toggleLike(
    @Body() body: ToggleLikeDto,
    @Req() req: Request,
  ): Promise<ToggleLikeResponseDto> {
    const kakaoId = req.user.userId;
    const id = body.id;
    return this.likesService.toggleLike({ id, kakaoId });
  }

  @ApiOperation({
    summary: '좋아요 누른 대상 조회하기',
    description: '{id}인 게시글에 좋아요를 누른 사람들을 확인한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: [FetchLikesResponseDto] })
  @HttpCode(200)
  @Get(':id')
  async fetchLikes(@Param('id') id: number): Promise<Likes[]> {
    return await this.likesService.fetchLikes({ id });
  }
}
