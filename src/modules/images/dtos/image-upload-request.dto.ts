import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImageUploadRequestDto {
  @ApiProperty({
    type: String,
    format: 'binary',
    description: ' multipart/form-data 이미지',
  })
  @IsNotEmpty()
  file: any;
}
