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
import { ArticlesDeleteDocs } from '../docs/articles-delete-docs.decorator';

@ArticlesDeleteDocs
@ApiTags('게시글 API')
@Controller('articles')
export class ArticlesDeleteController {
  constructor(private readonly svc_articlesDelete: ArticlesDeleteService) {}

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
