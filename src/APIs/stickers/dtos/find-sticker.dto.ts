import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindStickerInput {
  @ApiProperty({ description: '찾을 스티커의 id', type: Number })
  @IsNumber()
  id: number;
}

export class FindStickerDto extends FindStickerInput {
  @IsNumber()
  kakaoId: number;
}
