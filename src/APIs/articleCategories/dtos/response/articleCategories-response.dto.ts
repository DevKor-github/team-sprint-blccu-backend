import { ApiProperty } from '@nestjs/swagger';

export class ArticleCategoriesResponseDto {
  @ApiProperty({ type: Number })
  articleCount: number;

  @ApiProperty({ type: Number })
  categoryId: number;

  @ApiProperty({ type: String })
  categoryName: string;
}
