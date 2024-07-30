import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlesReadService } from '../services/articles-read.service';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ArticleDto } from '../dtos/common/article.dto';
import { ArticleDetailResponseDto } from '../dtos/response/article-detail-response.dto';
import { ArticleDetailForUpdateResponseDto } from '../dtos/response/article-detail-for-update-response.dto';
import { ArticlesGetRequestDto } from '../dtos/request/articles-get-request.dto';
import { ArticlesPaginateService } from '../services/articles-paginate.service';
import { SortOption } from 'src/common/enums/sort-option';
import { CustomCursorPageDto } from 'src/utils/cursor-pages/dtos/cursor-page.dto';
import { ArticlesGetUserRequestDto } from '../dtos/request/articles-get-user-request.dto';
import { ArticlesReadDocs } from '../docs/articles-read-docs.decorator';

@ApiTags('게시글 API')
@Controller('articles')
@ArticlesReadDocs
export class ArticlesReadController {
  constructor(
    private readonly svc_articlesRead: ArticlesReadService,
    private readonly svc_articlesPaginate: ArticlesPaginateService,
  ) {}

  @UseGuards(AuthGuardV2)
  @Get('temp')
  async fetchTempArticles(
    @Req() req: Request,
  ): Promise<ArticleDetailResponseDto[]> {
    const userId = req.user.userId;
    return await this.svc_articlesRead.readTempArticles({ userId });
  }

  @Get('detail/:articleId')
  async fetchArticleDetail(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<ArticleDetailResponseDto> {
    const userId = req.user.userId;
    return await this.svc_articlesRead.readArticleDetail({ userId, articleId });
  }

  @UseGuards(AuthGuardV2)
  @Get('update/:articleId')
  async fetchArticle(
    @Req() req: Request,
    @Param('articleId') articleId: number,
  ): Promise<ArticleDetailForUpdateResponseDto> {
    const userId = req.user.userId;
    return await this.svc_articlesRead.readArticleUpdateDetail({
      articleId,
      userId,
    });
  }

  @Get('cursor')
  async fetchCursor(
    @Query() cursorOption: ArticlesGetRequestDto,
  ): Promise<CustomCursorPageDto<ArticleDto>> {
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.svc_articlesPaginate.createDefaultCursor(
        7,
        7,
        '0',
      );
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.svc_articlesPaginate.createDefaultCursor(
        7,
        7,
        '9',
      );
    }
    return this.svc_articlesPaginate.fetchArticlesCursor({ cursorOption });
  }

  @UseGuards(AuthGuardV2)
  @Get('cursor/friends')
  async fetchFriendsCursor(
    @Query() cursorOption: ArticlesGetRequestDto,
    @Req() req: Request,
  ): Promise<CustomCursorPageDto<ArticleDto>> {
    const userId = req.user.userId;
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.svc_articlesPaginate.createDefaultCursor(
        7,
        7,
        '0',
      );
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.svc_articlesPaginate.createDefaultCursor(
        7,
        7,
        '9',
      );
    }
    return this.svc_articlesPaginate.fetchFriendsArticlesCursor({
      cursorOption,
      userId,
    });
  }

  @Get('/cursor/user/:userId')
  async fetchUserArticles(
    @Param('userId') targetUserId: number,
    @Req() req: Request,
    @Query() cursorOption: ArticlesGetUserRequestDto,
  ): Promise<CustomCursorPageDto<ArticleDto>> {
    const userId = req.user.userId;
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.svc_articlesPaginate.createDefaultCursor(
        7,
        7,
        '0',
      );
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.svc_articlesPaginate.createDefaultCursor(
        7,
        7,
        '9',
      );
    }
    return await this.svc_articlesPaginate.fetchUserArticlesCursor({
      userId,
      targetUserId,
      cursorOption,
    });
  }
}
