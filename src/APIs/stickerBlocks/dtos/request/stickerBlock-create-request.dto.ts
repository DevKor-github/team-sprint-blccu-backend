import { OmitType } from '@nestjs/swagger';
import { StickerBlock } from '../entities/stickerblock.entity';
import { StickerBlockDto } from '../common/stickerBlock.dto';

export class StickerBlockCreateRequestDto extends OmitType(StickerBlockDto, [
  'id',
  'articleId',
  'stickerId',
  'dateCreated',
  'dateDeleted',
  'dateUpdated',
]) {}

//인터페이스화?
export class CreateStickerBlockDto extends StickerBlockCreateRequestDto {
  articleId: number;
  stickerId: number;
  userId: number;
}
