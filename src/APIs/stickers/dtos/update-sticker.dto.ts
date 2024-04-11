import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUrl } from 'class-validator';
import { URL } from 'url';

export class UpdateStickerInput {
  @ApiProperty({ description: '찾을 스티커의 id', type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '변경할 url', type: String })
  @IsUrl()
  image_url: string;
}
export class UpdateStickerDto extends UpdateStickerInput {
  @IsNumber()
  kakaoId: number;
}
