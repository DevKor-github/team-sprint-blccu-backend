import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostCategory } from '../entities/postCategory.entity';
export class FetchPostCategoryDto extends OmitType(PostCategory, ['user']) {}

export class FetchPostCategoriesDto {
  @ApiProperty({ type: Number })
  postCount: number;

  @ApiProperty({ type: String })
  categoryId: string;

  @ApiProperty({ type: String })
  categoryName: string;
}
