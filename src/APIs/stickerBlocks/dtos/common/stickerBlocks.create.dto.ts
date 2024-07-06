import { OmitType } from '@nestjs/swagger';
import { StickerBlockDto } from './stickerBlock.dto';

export class StickerBlocksCreateDto extends OmitType(StickerBlockDto, [
  'id',
  'articleId',
  'dateCreated',
  'dateDeleted',
  'dateUpdated',
]) {}
