import { OmitType } from '@nestjs/swagger';
import { StickerBlock } from '../entities/stickerblock.entity';

export class CreateStickerBlockInput extends OmitType(StickerBlock, [
  'id',
  'posts',
  'postsId',
  'sticker',
  'stickerId',
]) {}

export class CreateStickerBlockDto extends CreateStickerBlockInput {
  postsId: number;
  stickerId: number;
}
