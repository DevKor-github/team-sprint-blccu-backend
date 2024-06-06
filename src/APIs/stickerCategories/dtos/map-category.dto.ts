import { ApiProperty } from '@nestjs/swagger';

export class MapCategoryDto {
  @ApiProperty({ description: '매핑 하고자 하는 스티커의 id', type: Number })
  stickerId: number;

  @ApiProperty({ description: '매핑 하고자 하는 카테고리의 id', type: Number })
  stickerCategoryId: number;
}

export class BulkMapCategoryDto {
  @ApiProperty({
    description: '매핑할 카테고리 및 스티커 배열',
    type: [MapCategoryDto],
  })
  maps: MapCategoryDto[];
}
