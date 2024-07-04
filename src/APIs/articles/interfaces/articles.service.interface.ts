import { Article } from '../entities/article.entity';

export interface IArticlesServiceArticleId extends Pick<Article, 'id'> {}

export interface IArticlesServiceArticleUserIdPair {
  id: number;
  kakaoId: number;
}

export interface IArticlesServiceCreate extends CreateArticleInput {
  userKakaoId: number;

  isPublished: boolean;
}

export interface IArticlesServiceFetchArticleForUpdate {
  id: number;
  kakaoId: number;
}

export interface IArticlesServiceCreateCursorResponse {
  cursorOption: CursorFetchArticles;
  articles: Article[];
}

export interface IArticlesServiceFetchArticlesCursor {
  cursorOption: CursorFetchArticles;
}

export interface IArticlesServiceFetchFriendsArticlesCursor {
  cursorOption: CursorFetchArticles;
  kakaoId: number;
}

export interface IArticlesServiceFetchUserArticlesCursor {
  cursorOption: FetchUserArticlesInput;
  targetKakaoId: number;
  kakaoId: number;
}

export interface IArticlesServicePatchArticle extends PatchArticleInput {
  kakaoId: number;
  id: number;
}
