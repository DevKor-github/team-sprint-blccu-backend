import { ApiProperty } from '@nestjs/swagger';
import { OpenScope } from 'src/commons/enums/open-scope.enum';

export class ToggleLikeResponseDto {
  @ApiProperty({ description: '포스트의 고유 아이디', type: Number })
  id: number;

  @ApiProperty({ description: '제목(최대 100자)', type: String })
  title: string;

  @ApiProperty({ description: '임시저장(false), 발행(true)', type: Boolean })
  isPublished: boolean;

  @ApiProperty({ description: '좋아요 카운트', type: Number })
  like_count: number;

  @ApiProperty({ description: '조회수 카운트', type: Number })
  view_count: number;

  @ApiProperty({ description: '댓글 허용 여부(boolean)', type: Boolean })
  allow_comment: boolean;

  @ApiProperty({
    description:
      '[공개 설정] PUBLIC: 전체공개, PROTECTED: 친구공개, PRIVATE: 비공개',
    type: 'enum',
    enum: OpenScope,
  })
  scope: OpenScope;

  @ApiProperty({ description: '생성된 날짜', type: Date })
  date_created: Date;

  @ApiProperty({ description: '수정된 날짜', type: Date })
  date_updated: Date;

  @ApiProperty({ description: 'soft delete column', type: Date })
  date_deleted: Date;
}
