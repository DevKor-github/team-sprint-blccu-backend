import { ApiProperty } from '@nestjs/swagger';
import { StickerCategoryMapperDto } from '../common/stickerCategoryMapper.dto';

export class StickerCategoriesMapDto {
  @ApiProperty({
    description: '매핑할 카테고리 및 스티커 배열',
    type: [StickerCategoryMapperDto],
  })
  maps: StickerCategoryMapperDto[];
}
