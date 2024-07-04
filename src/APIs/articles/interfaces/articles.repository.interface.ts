import { ArticlesOrderOptionWrap } from 'src/common/enums/articles-order-option';
import { SortOption } from 'src/common/enums/sort-option';
import {
  IArticlesServiceFetchArticlesCursor,
  IArticlesServiceFetchFriendsArticlesCursor,
  IArticlesServiceFetchUserArticlesCursor,
} from './articles.service.interface';
import { OpenScope } from 'src/common/enums/open-scope.enum';

export interface IArticlesRepoGetCursorQuery {
  order: ArticlesOrderOptionWrap;
  sort: SortOption;
  take: number;
  cursor: string;
}

export interface IArticlesRepoFetchArticlesCursor
  extends IArticlesServiceFetchArticlesCursor {
  date_filter: Date;
}

export interface IArticlesRepoFetchFriendsArticlesCursor
  extends Pick<IArticlesServiceFetchFriendsArticlesCursor, 'cursorOption'> {
  date_filter: Date;
  userId: number;
}

export interface IArticlesRepoFetchUserArticlesCursor
  extends Pick<IArticlesServiceFetchUserArticlesCursor, 'cursorOption'> {
  date_filter: Date;
  scope: OpenScope[];
  userId: number;
}
