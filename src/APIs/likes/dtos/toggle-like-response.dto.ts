import { OmitType } from '@nestjs/swagger';
import { Posts } from 'src/APIs/posts/entities/posts.entity';

export class ToggleLikeResponseDto extends OmitType(Posts, [
  'postBackground',
  'postCategory',
  'user',
]) {}
