import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty({
    type: String,
    description: '카테고리 이름',
  })
  @IsNotEmpty()
  name: string;
}
