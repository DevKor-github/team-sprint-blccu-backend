import { ApiProperty } from '@nestjs/swagger';

export class ArticleCategoriesResponseDto {
  @ApiProperty({ type: Number })
  postCount: number;

  @ApiProperty({ type: String })
  categoryId: string;

  @ApiProperty({ type: String })
  categoryName: string;
}
