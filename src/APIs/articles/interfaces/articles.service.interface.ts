import { ArticleCreateRequestDto } from '../dtos/request/article-create-request.dto';
import { ArticlePatchRequestDto } from '../dtos/request/article-patch-request.dto';
import { ArticlesGetRequestDto } from '../dtos/request/articles-get-request.dto';
import { ArticlesGetUserRequestDto } from '../dtos/request/articles-get-user-request.dto';
import { Article } from '../entities/article.entity';

export interface IArticlesServiceArticleId {
  articleId: number;
}

export interface IArticlesServiceArticleUserIdPair {
  articleId: number;
  userId: number;
}

export interface IArticlesServiceCreate extends ArticleCreateRequestDto {
  userId: number;
  isPublished: boolean;
}

export interface IArticlesServiceCreateCursorResponse {
  cursorOption: ArticlesGetRequestDto;
  articles: Article[];
}

export interface IArticlesServiceFetchArticlesCursor {
  cursorOption: ArticlesGetRequestDto;
}

export interface IArticlesServiceFetchFriendsArticlesCursor {
  cursorOption: ArticlesGetRequestDto;
  userId: number;
}

export interface IArticlesServiceFetchUserArticlesCursor {
  cursorOption: ArticlesGetUserRequestDto;
  targetUserId: number;
  userId: number;
}

export interface IArticlesServicePatchArticle extends ArticlePatchRequestDto {
  userId: number;
  articleId: number;
}
