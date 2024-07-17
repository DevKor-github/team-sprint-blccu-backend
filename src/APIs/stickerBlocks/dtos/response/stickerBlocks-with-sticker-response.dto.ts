import { StickerDto } from 'src/APIs/stickers/dtos/common/sticker.dto';
import { StickerBlockDto } from '../common/stickerBlock.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StickerBlocksWithStickerResponseDto extends StickerBlockDto {
  @ApiProperty({ type: StickerDto })
  sticker: StickerDto;
}
