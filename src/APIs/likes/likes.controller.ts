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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { LikesGetResponseDto } from './dtos/response/likes-get-response.dto';
import { LikesDocs } from './docs/likes-docs.decorator';

@LikesDocs
@ApiTags('게시글 API')
@Controller('articles/:articleId')
export class LikesController {
  constructor(private readonly svc_likes: LikesService) {}

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

  @UseGuards(AuthGuardV2)
  @Get('like')
  async fetchIfLiked(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<boolean> {
    const userId = req.user.userId;
    return await this.svc_likes.checkIfLiked({ userId, articleId });
  }

  @Get('like-users')
  async fetchLikes(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<UserFollowingResponseDto[]> {
    const userId = req.user.userId;
    return await this.svc_likes.findLikes({ articleId, userId });
  }
}
