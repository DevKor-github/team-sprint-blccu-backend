import { OmitType } from '@nestjs/swagger';
import { Comment } from '../../entities/comment.entity';

export class CommentDto extends OmitType(Comment, [
  'article',
  'parent',
  'children',
  'reports',
  'user',
]) {}
