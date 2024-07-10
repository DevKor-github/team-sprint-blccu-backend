import { StickerDto } from 'src/APIs/stickers/dtos/common/sticker.dto';
import { StickerCategoryMapperDto } from '../common/stickerCategoryMapper.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StickersCategoryFetchStickersResponseDto extends StickerCategoryMapperDto {
  @ApiProperty({ type: StickerDto })
  sticker: StickerDto;
}
