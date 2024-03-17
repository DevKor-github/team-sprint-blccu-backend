import {
  Body,
  Controller,
  HttpCode,
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
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ToggleLikeResponseDto } from './dto/toggle-like-response.dto';

@ApiTags('좋아요 API')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: '좋아요 토글하기',
    description:
      '[Posts 테이블에 pessimistic_lock 적용] 로그인 된 유저가 {id}인 게시글에 좋아요를 토글한다.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({ description: '토글 성공', type: ToggleLikeResponseDto })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없는 경우' })
  @UseGuards(AuthGuard('jwt'))
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
}
