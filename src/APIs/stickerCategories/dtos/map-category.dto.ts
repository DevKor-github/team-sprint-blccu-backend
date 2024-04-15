import { ApiProperty } from '@nestjs/swagger';

export class MapCategoryDto {
  @ApiProperty({ description: '매핑 하고자 하는 스티커의 id', type: Number })
  stickerId: number;

  @ApiProperty({ description: '매핑 하고자 하는 카테고리의 id', type: Number })
  stickerCategoryId: number;
}
