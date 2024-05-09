import { PickType } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';

export class PatchCommentDto extends PickType(Comment, ['content']) {}
