import { OmitType } from '@nestjs/swagger';
import { StickerBlockDto } from '../common/stickerBlock.dto';

export class StickerBlockCreateRequestDto extends OmitType(StickerBlockDto, [
  'id',
  'articleId',
  'stickerId',
  'dateCreated',
  'dateDeleted',
  'dateUpdated',
]) {}
