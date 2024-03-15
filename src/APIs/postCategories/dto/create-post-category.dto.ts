import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  name: string;
}
