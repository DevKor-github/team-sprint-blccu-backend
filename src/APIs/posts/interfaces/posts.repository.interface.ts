import { PostsOrderOptionWrap } from 'src/common/enums/posts-order-option';
import { SortOption } from 'src/common/enums/sort-option';
import {
  IPostsServiceFetchPostsCursor,
  IPostsServiceFetchFriendsPostsCursor,
  IPostsServiceFetchUserPostsCursor,
} from './posts.service.interface';
import { OpenScope } from 'src/common/enums/open-scope.enum';

export interface IPostsRepoGetCursorQuery {
  order: PostsOrderOptionWrap;
  sort: SortOption;
  take: number;
  cursor: string;
}

export interface IPostsRepoFetchPostsCursor
  extends IPostsServiceFetchPostsCursor {
  date_filter: Date;
}

export interface IPostsRepoFetchFriendsPostsCursor
  extends Pick<IPostsServiceFetchFriendsPostsCursor, 'cursorOption'> {
  date_filter: Date;
  subQuery: string;
}

export interface IPostsRepoFetchUserPostsCursor
  extends Pick<IPostsServiceFetchUserPostsCursor, 'cursorOption'> {
  date_filter: Date;
  scope: OpenScope[];
  userKakaoId: number;
}
