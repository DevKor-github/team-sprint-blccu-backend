import { ApiProperty } from '@nestjs/swagger';
import { CustomCursorPageMetaDto } from 'src/utils/cursor-pages/dtos/cursor-page-meta.dto';
import { ArticleDto } from '../common/article.dto';

export class ArticlesGetResponseDto {
  @ApiProperty({ description: '조회된 데이터', type: [ArticleDto] })
  readonly data: ArticleDto[];

  @ApiProperty({
    description: '페이지네이션 메타 데이터',
    type: CustomCursorPageMetaDto,
  })
  readonly meta: CustomCursorPageMetaDto;
}
