import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveBgDto {
  @ApiProperty({
    description: '이미지가 저장된 url',
    type: String,
  })
  @IsString()
  url: string;
}
