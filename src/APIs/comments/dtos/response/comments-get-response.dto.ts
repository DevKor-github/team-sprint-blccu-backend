import { ApiProperty } from '@nestjs/swagger';
import { CommentChildrenDto } from '../common/comment-children.dto';

export class CommentsGetResponseDto extends CommentChildrenDto {
  @ApiProperty({ description: '자식 댓글 배열', type: [CommentChildrenDto] })
  children: CommentChildrenDto[];
}
