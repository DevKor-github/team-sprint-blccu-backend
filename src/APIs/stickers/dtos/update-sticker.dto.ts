import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class UpdateStickerInput {
  @ApiProperty({ description: '변경할 url', type: String, required: false })
  @IsUrl()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: '재사용 가능 여부 설정',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isReusable?: boolean;
}
export class UpdateStickerDto extends UpdateStickerInput {
  @IsNumber()
  kakaoId: number;

  id: number;
}
