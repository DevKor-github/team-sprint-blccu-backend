import { ApiProperty } from '@nestjs/swagger';
import { CustomCursorPageMetaDto } from 'src/utils/cursor-pages/dtos/cursor-page-meta.dto';
import { PostResponseDto } from './post-response.dto';

export class CursorPagePostResponseDto {
  @ApiProperty({ description: '조회된 데이터', type: [PostResponseDto] })
  readonly data: PostResponseDto[];

  @ApiProperty({
    description: '페이지네이션 메타 데이터',
    type: CustomCursorPageMetaDto,
  })
  readonly meta: CustomCursorPageMetaDto;
}
