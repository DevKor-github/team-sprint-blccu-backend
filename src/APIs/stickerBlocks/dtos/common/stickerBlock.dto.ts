import { OmitType } from '@nestjs/swagger';
import { StickerBlock } from '../../entities/stickerblock.entity';

export class StickerBlockDto extends OmitType(StickerBlock, [
  'sticker',
  'article',
]) {}
