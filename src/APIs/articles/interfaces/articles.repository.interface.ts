import { SortOption } from 'src/common/enums/sort-option';
import {
  IArticlesServiceFetchArticlesCursor,
  IArticlesServiceFetchFriendsArticlesCursor,
  IArticlesServiceFetchUserArticlesCursor,
} from './articles.service.interface';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import { ArticleOrderOptionWrap } from 'src/common/enums/article-order-option';

export interface IArticlesRepoGetCursorQuery {
  order: ArticleOrderOptionWrap;
  sort: SortOption;
  take: number;
  cursor: string;
}

export interface IArticlesRepoFetchArticlesCursor
  extends IArticlesServiceFetchArticlesCursor {
  dateFilter: Date;
}

export interface IArticlesRepoFetchFriendsArticlesCursor
  extends Pick<IArticlesServiceFetchFriendsArticlesCursor, 'cursorOption'> {
  dateFilter: Date;
  userId: number;
}

export interface IArticlesRepoFetchUserArticlesCursor
  extends Pick<IArticlesServiceFetchUserArticlesCursor, 'cursorOption'> {
  dateFilter: Date;
  scope: OpenScope[];
  userId: number;
}
