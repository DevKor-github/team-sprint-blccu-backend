import { FetchUserPostsInput } from './fetch-user-posts.input';

export class FetchUserPostsDto extends FetchUserPostsInput {
  kakaoId: number;

  targetKakaoId: number;
}
