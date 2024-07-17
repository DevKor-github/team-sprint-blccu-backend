import { ApiProperty, PickType } from '@nestjs/swagger';
import { CommentDto } from '../common/comment.dto';

export class CommentCreateRequestDto extends PickType(CommentDto, ['content']) {
  @ApiProperty({
    description: '[optional] 부모 댓글 id',
    type: Number,
    required: false,
  })
  parentId?: number;
}
