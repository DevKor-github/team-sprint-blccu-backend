import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadResponseDto {
  @ApiProperty({ type: String, description: '이미지가 저장된 url' })
  imageUrl: string;
}
