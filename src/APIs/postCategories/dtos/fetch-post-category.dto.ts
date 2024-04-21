import { ApiProperty } from '@nestjs/swagger';

export class FetchPostCategoryDto {
  @ApiProperty({ type: Number })
  postCount: number;

  @ApiProperty({ type: String })
  categoryId: string;

  @ApiProperty({ type: String })
  categoryName: string;
}
