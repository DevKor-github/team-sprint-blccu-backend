import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ArticlesGetRequestDto } from './articles-get-request.dto';

export class ArticlesGetUserRequestDto extends ArticlesGetRequestDto {
  @ApiProperty({
    description: '필터링할 카테고리 아이디',
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  categoryId?: number | null;
}
