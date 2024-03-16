import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty({
    type: 'string',
    example: '카테고리 이름',
  })
  @IsNotEmpty()
  name: string;
}
