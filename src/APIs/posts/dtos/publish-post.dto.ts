import { OmitType } from '@nestjs/swagger';
import { Posts } from '../entities/posts.entity';

export class PublishPostDto extends OmitType(Posts, [
  'postBackground',
  'user',
  'postCategory',
]) {}
