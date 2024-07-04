import { ApiProperty } from '@nestjs/swagger';
import { ArticleCategoryDto } from './articleCategory.dto';
export class FetchArticleCategoryResponse extends ArticleCategoryDto {}

export class FetchArticleCategoriesResponse {
  @ApiProperty({ type: Number })
  postCount: number;

  @ApiProperty({ type: String })
  categoryId: string;

  @ApiProperty({ type: String })
  categoryName: string;
}
