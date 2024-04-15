import { CreatePostInput } from './create-post.input';

export class CreatePostDto extends CreatePostInput {
  userKakaoId: number;

  isPublished: boolean;
}
