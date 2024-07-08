import { OmitType } from '@nestjs/swagger';
import { StickerCategoryMapper } from '../../entities/stickerCategoryMapper.entity';

export class StickerCategoryMapperDto extends OmitType(StickerCategoryMapper, [
  'sticker',
  'stickerCategory',
]) {}
