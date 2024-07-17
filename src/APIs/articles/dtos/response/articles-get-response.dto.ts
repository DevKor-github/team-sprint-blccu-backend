import { ApiProperty } from '@nestjs/swagger';
import { CustomCursorPageMetaDto } from 'src/utils/cursor-pages/dtos/cursor-page-meta.dto';
import { ArticleWithUserDto } from '../common/article-with-user.dto';

export class ArticlesGetResponseDto {
  @ApiProperty({ description: '조회된 데이터', type: [ArticleWithUserDto] })
  readonly data: ArticleWithUserDto[];

  @ApiProperty({
    description: '페이지네이션 메타 데이터',
    type: CustomCursorPageMetaDto,
  })
  readonly meta: CustomCursorPageMetaDto;
}
