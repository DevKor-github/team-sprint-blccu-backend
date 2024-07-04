import { CreatePostInput } from '../dtos/create-post.input';
import { CursorFetchPosts } from '../dtos/cursor-fetch-posts.dto';
import { FetchUserPostsInput } from '../dtos/fetch-user-posts.input';
import { PatchPostInput } from '../dtos/patch-post.dto';
import { Posts } from '../entities/article.entity';

export interface IPostsServicePostId extends Pick<Posts, 'id'> {}

export interface IPostsServicePostUserIdPair {
  id: number;
  kakaoId: number;
}

export interface IPostsServiceCreate extends CreatePostInput {
  userKakaoId: number;

  isPublished: boolean;
}

export interface IPostsServiceFetchPostForUpdate {
  id: number;
  kakaoId: number;
}

export interface IPostsServiceCreateCursorResponse {
  cursorOption: CursorFetchPosts;
  posts: Posts[];
}

export interface IPostsServiceFetchPostsCursor {
  cursorOption: CursorFetchPosts;
}

export interface IPostsServiceFetchFriendsPostsCursor {
  cursorOption: CursorFetchPosts;
  kakaoId: number;
}

export interface IPostsServiceFetchUserPostsCursor {
  cursorOption: FetchUserPostsInput;
  targetKakaoId: number;
  kakaoId: number;
}

export interface IPostsServicePatchPost extends PatchPostInput {
  kakaoId: number;
  id: number;
}
