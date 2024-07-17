import { PickType } from '@nestjs/swagger';
import { CommentDto } from '../common/comment.dto';

export class CommentPatchRequestDto extends PickType(CommentDto, ['content']) {}
