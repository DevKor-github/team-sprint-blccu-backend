import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlesUpdateService } from '../services/articles-update.service';
import { ArticleDto } from '../dtos/common/article.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { ArticlePatchRequestDto } from '../dtos/request/article-patch-request.dto';
import { Request } from 'express';
import { ArticlesUpdateDocs } from '../docs/articles-update-doc.decorator';

@ArticlesUpdateDocs
@ApiTags('게시글 API')
@Controller('articles')
export class ArticlesUpdateController {
  constructor(private readonly svc_articlesUpdate: ArticlesUpdateService) {}

  @UseGuards(AuthGuardV2)
  @Patch(':articleId')
  async patchArticle(
    @Req() req: Request,
    @Body() body: ArticlePatchRequestDto,
    @Param('articleId') articleId: number,
  ): Promise<ArticleDto> {
    const userId = req.user.userId;
    return await this.svc_articlesUpdate.patchArticle({
      ...body,
      articleId,
      userId,
    });
  }
}
