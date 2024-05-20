import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: '루트 게시글 아이디',
    type: Number,
  })
  postsId: number;

  @ApiProperty({
    description: '댓글 내용',
    type: String,
  })
  content: string;

  @ApiProperty({
    description: '[optional] 부모 댓글 id',
    type: Number,
    required: false,
  })
  parentId?: number;

  userKakaoId: number;
}

export class CreateCommentInput extends OmitType(CreateCommentDto, [
  'userKakaoId',
  'postsId',
]) {}
