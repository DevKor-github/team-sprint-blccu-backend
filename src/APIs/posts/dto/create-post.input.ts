import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OpenScope } from 'src/commons/enums/open-scope.enum';

export class CreatePostInput {
  @ApiProperty({ description: '임시저장 된 포스트의 아이디', type: Number })
  id: number;

  @ApiProperty({ description: '지정할 카테고리의 아이디', type: String })
  postCategory: string;

  @ApiProperty({ description: '지정할 내지의 아이디', type: String })
  postBackground: string;

  @ApiProperty({ description: '제목 설정(최대 100자)', type: String })
  title: string;

  @ApiProperty({ description: '댓글 허용 여부(boolean)', type: Boolean })
  allow_comment: boolean;

  @ApiProperty({
    description:
      '[공개 설정] PUBLIC: 전체공개, PROTECTED: 친구공개, PRIVATE: 비공개',
    type: 'enum',
    enum: OpenScope,
  })
  @IsEnum(Object.values(OpenScope))
  scope: OpenScope;
}
