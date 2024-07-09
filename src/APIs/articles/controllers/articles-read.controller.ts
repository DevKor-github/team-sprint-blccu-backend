import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticlesReadService } from '../services/articles-read.service';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ArticleDto } from '../dtos/common/article.dto';
import { ArticleDetailResponseDto } from '../dtos/response/article-detail-response.dto';
import { ArticleDetailForUpdateResponseDto } from '../dtos/response/article-detail-for-update-response.dto';
import { ArticlesGetResponseDto } from '../dtos/response/articles-get-response.dto';
import { ArticlesGetRequestDto } from '../dtos/request/articles-get-request.dto';
import { ArticlesPaginateService } from '../services/articles-paginate.service';
import { SortOption } from 'src/common/enums/sort-option';
import { CustomCursorPageDto } from 'src/utils/cursor-pages/dtos/cursor-page.dto';
import { ArticlesGetUserRequestDto } from '../dtos/request/articles-get-user-request.dto';

@ApiTags('게시글 API')
@Controller('articles')
export class ArticlesReadController {
  constructor(
    private readonly svc_articlesRead: ArticlesReadService,
    private readonly svc_articlesPaginate: ArticlesPaginateService,
  ) {}

  @ApiOperation({
    summary: '임시작성 게시글 조회',
    description: '로그인된 유저의 임시작성 게시글을 조회한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [ArticleDto] })
  @UseGuards(AuthGuardV2)
  @Get('temp')
  async fetchTempArticles(@Req() req: Request): Promise<ArticleDto[]> {
    const userId = req.user.userId;
    return await this.svc_articlesRead.readTempArticles({ userId });
  }

  @ApiOperation({
    summary: '게시글 디테일 뷰 fetch',
    description:
      'id에 해당하는 게시글을 가져온다. 조회수를 올린다. 보호된 게시글은 권한이 있는 사용자만 접근 가능하다.',
  })
  @Get('detail/:articleId')
  @ApiOkResponse({ type: ArticleDetailResponseDto })
  async fetchArticleDetail(
    @Param('articleId') articleId: number,
    @Req() req: Request,
  ): Promise<ArticleDetailResponseDto> {
    const userId = req.user.userId;
    return await this.svc_articlesRead.readArticleDetail({ userId, articleId });
  }

  @ApiOperation({
    summary: '[수정용] 게시글 및 스티커 상세 데이터 fetch',
    description:
      '본인 게시글 수정용으로 id에 해당하는 게시글에 조인된 스티커 블록들의 값과 게시글 세부 데이터를 모두 가져온다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: ArticleDetailForUpdateResponseDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
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

  @ApiOperation({
    summary: '[cursor]전체 게시글 조회 API',
    description:
      '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다. PUBLIC 게시글만 조회한다.',
  })
  @Get('cursor')
  @ApiOkResponse({ type: ArticlesGetResponseDto })
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

  @ApiOperation({
    summary: '[cursor]친구 게시글 조회 API',
    description:
      '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Get('cursor/friends')
  @ApiOkResponse({ type: ArticlesGetResponseDto })
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

  @ApiOperation({
    summary: '[cursor]특정 유저의 게시글 조회',
    description:
      '로그인 된 유저의 경우 private/protected 게시글 조회 권한 체크 후 조회. 카테고리 이름으로 필터링 가능',
  })
  @Get('/cursor/user/:userId')
  @ApiOkResponse({ type: ArticlesGetResponseDto })
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
