import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FetchUserPostsInput {
  @ApiProperty({
    description: '필터링할 카테고리 이름',
    type: String,
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  postCategoryName?: string | null;
}
