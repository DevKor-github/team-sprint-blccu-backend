import { Inject, Injectable } from '@nestjs/common';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesPaginateRepository } from '../repositories/articles-paginate.repository.ts';
import { ArticleOrderOption } from 'src/common/enums/article-order-option';
import { CustomCursorPageMetaDto } from 'src/utils/cursor-pages/dtos/cursor-page-meta.dto';
import { CustomCursorPageDto } from 'src/utils/cursor-pages/dtos/cursor-page.dto';
import { FollowsService } from 'src/APIs/follows/follows.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  IArticlesServiceCreateCursorResponse,
  IArticlesServiceFetchArticlesCursor,
  IArticlesServiceFetchFriendsArticlesCursor,
  IArticlesServiceFetchUserArticlesCursor,
} from '../interfaces/articles.service.interface';
import { ArticleDto } from '../dtos/common/article.dto';
import { getDate } from 'src/utils/dateUtils';

@Injectable()
export class ArticlesPaginateService {
  constructor(
    // private readonly dataSource: DataSource,
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly repo_articlesPaginate: ArticlesPaginateRepository,
    private readonly svc_follow: FollowsService,
    @Inject(CACHE_MANAGER) private db_cacheManager: Cache,
  ) {}

  createDefaultCursor(
    digitById: number,
    digitByTargetColumn: number,
    initialValue: string,
  ) {
    const defaultCustomCursor: string =
      String().padStart(digitByTargetColumn, `${initialValue}`) +
      String().padStart(digitById, `${initialValue}`);
    return defaultCustomCursor;
  }

  async createCustomCursor({ article, order }): Promise<string> {
    const id = article.id;
    const _order = article[order];
    const customCursor: string =
      String(_order).padStart(7, '0') + String(id).padStart(7, '0');

    return customCursor;
  }

  async createCursorResponse({
    cursorOption,
    articles,
  }: IArticlesServiceCreateCursorResponse): Promise<
    CustomCursorPageDto<ArticleDto>
  > {
    const order = ArticleOrderOption[cursorOption.order];
    let hasNextData: boolean = true;
    let customCursor: string;

    const takePerPage = cursorOption.take;
    const isLastPage = articles.length <= takePerPage;
    const responseData = articles.slice(0, takePerPage);
    const lastDataPerPage = responseData[responseData.length - 1];

    if (isLastPage) {
      hasNextData = false;
      customCursor = null;
    } else {
      customCursor = await this.createCustomCursor({
        article: lastDataPerPage,
        order,
      });
    }

    const customCursorPageMetaDto = new CustomCursorPageMetaDto({
      customCursorPageOptionsDto: cursorOption,
      hasNextData,
      customCursor,
    });

    return new CustomCursorPageDto(responseData, customCursorPageMetaDto);
  }

  async fetchArticlesCursor({
    cursorOption,
  }: IArticlesServiceFetchArticlesCursor): Promise<
    CustomCursorPageDto<ArticleDto>
  > {
    const cacheKey = `fetchArticlesCursor_${JSON.stringify(cursorOption)}`;

    const cachedArticles =
      await this.db_cacheManager.get<CustomCursorPageDto<ArticleDto>>(cacheKey);
    if (cachedArticles) {
      return cachedArticles;
    }

    let dateFilter: Date;
    if (cursorOption.dateCreated)
      dateFilter = getDate(cursorOption.dateCreated);
    const { articles } = await this.repo_articlesPaginate.fetchArticlesCursor({
      cursorOption,
      dateFilter,
    });
    const result = await this.createCursorResponse({ articles, cursorOption });
    await this.db_cacheManager.set(cacheKey, result, 180000);
    return result;
  }

  async fetchFriendsArticlesCursor({
    cursorOption,
    userId,
  }: IArticlesServiceFetchFriendsArticlesCursor): Promise<
    CustomCursorPageDto<ArticleDto>
  > {
    let dateFilter: Date;
    if (cursorOption.dateCreated)
      dateFilter = getDate(cursorOption.dateCreated);

    const { articles } =
      await this.repo_articlesPaginate.fetchFriendsArticlesCursor({
        cursorOption,
        userId,
        dateFilter,
      });
    return await this.createCursorResponse({ articles, cursorOption });
  }

  async fetchUserArticlesCursor({
    userId,
    targetUserId,
    cursorOption,
  }: IArticlesServiceFetchUserArticlesCursor): Promise<
    CustomCursorPageDto<ArticleDto>
  > {
    let dateFilter: Date;
    if (cursorOption.dateCreated)
      dateFilter = getDate(cursorOption.dateCreated);

    const scope = await this.svc_follow.getScope({
      fromUser: targetUserId,
      toUser: userId,
    });
    const { articles } = await this.repo_articlesPaginate.fetchUserArticles({
      cursorOption,
      dateFilter,
      scope,
      userId: targetUserId,
    });
    return await this.createCursorResponse({ articles, cursorOption });
  }
}
