import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentDto {
  @ApiProperty({
    description: '삭제하고자 하는 댓글 id',
    type: Number,
  })
  id: number;
}
