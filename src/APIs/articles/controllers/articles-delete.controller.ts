import {
  Body,
  Controller,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticlesDeleteService } from '../services/articles-delete.service';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ArticleDeleteRequestDto } from '../dtos/request/article-delete-request.dto';

@ApiTags('게시글 API')
@Controller('articles')
export class ArticlesDeleteController {
  constructor(private readonly svc_articlesDelete: ArticlesDeleteService) {}

  @ApiOperation({
    summary: '게시글 삭제',
    description:
      '로그인 된 유저의 postId에 해당하는 게시글을 삭제한다. isHardDelete(nullable)을 통해 삭제 방식 결정',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Delete(':articleId')
  async softDelete(
    @Req() req: Request,
    @Param('articleId') articleId: number,
    @Body() body: ArticleDeleteRequestDto,
  ) {
    const userId = req.user.userId;
    if (body.isHardDelete === true) {
      return await this.svc_articlesDelete.hardDelete({ userId, articleId });
    }
    return await this.svc_articlesDelete.softDelete({ userId, articleId });
  }
}
