// page-option.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PostsOrderOptionWrap } from 'src/commons/enums/posts-order-option';
import { SortOption } from 'src/commons/enums/sort-option';

export class CustomCursorPageOptionsDto {
  @ApiProperty({
    description: '정렬 옵션',
    type: 'enum',
    enum: SortOption,
    required: false,
    default: SortOption.ASC,
  })
  @Type(() => String)
  @IsEnum(SortOption)
  @IsOptional()
  readonly sort?: SortOption = SortOption.ASC;

  @ApiProperty({
    description: '페이지네이션 단위',
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  readonly take?: number = 5;

  @ApiProperty({
    description: '정렬 옵션',
    type: 'enum',
    enum: PostsOrderOptionWrap,
    required: false,
    default: PostsOrderOptionWrap.DATE,
  })
  order?: PostsOrderOptionWrap = PostsOrderOptionWrap.DATE;

  @ApiProperty({ description: '커서', type: String, required: false })
  @Type(() => String)
  @IsOptional()
  customCursor?: string;
}
