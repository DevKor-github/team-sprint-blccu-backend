import { OmitType } from '@nestjs/swagger';
import { StickerBlock } from '../entities/stickerblock.entity';

export class CreateStickerBlockDto extends OmitType(StickerBlock, [
  'id',
  'posts',
  'sticker',
]) {}
