import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Likes } from '../entities/like.entity';
import { Posts } from 'src/APIs/posts/entities/posts.entity';

export class FetchLikesDto {
  @ApiProperty({ type: Number, description: 'post_id' })
  postsId: number;
}

export class FetchLikeResponseDto extends PickType(Likes, ['id', 'postsId']) {
  @ApiProperty({
    type: OmitType(Posts, ['user', 'postCategory', 'postBackground']),
  })
  posts: Omit<Posts, 'user' | 'postCategory' | 'postBackground'>;

  @ApiProperty({ type: Number })
  userKakaoId: number;
}
