import { ApiProperty } from '@nestjs/swagger';
import { StickerCategoryMapperCreateRequestDto } from './stickerCategoryMapper-create-request.dto';

export class StickerCategoriesMapDto {
  @ApiProperty({
    description: '매핑할 카테고리 및 스티커 배열',
    type: [StickerCategoryMapperCreateRequestDto],
  })
  maps: StickerCategoryMapperCreateRequestDto[];
}
