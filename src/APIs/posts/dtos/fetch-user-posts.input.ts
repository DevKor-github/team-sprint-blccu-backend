import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CursorFetchPosts } from './cursor-fetch-posts.dto';

export class FetchUserPostsInput extends CursorFetchPosts {
  @ApiProperty({
    description: '필터링할 카테고리 이름',
    type: String,
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  postCategoryName?: string | null;
}
