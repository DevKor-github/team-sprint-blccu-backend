import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class StickerPatchRequestDto {
  @ApiProperty({ description: '변경할 url', type: String, required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: '재사용 가능 여부 설정',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isReusable?: boolean;
}
