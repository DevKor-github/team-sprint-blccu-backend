import { OmitType } from '@nestjs/swagger';
import { Posts } from 'src/APIs/posts/entities/posts.entity';
import { Likes } from '../entities/like.entity';

export class ToggleLikeResponseDto extends OmitType(Posts, [
  'postBackground',
  'postCategory',
  'user',
]) {}

export class FetchLikeDto extends OmitType(Likes, ['user', 'posts']) {}
