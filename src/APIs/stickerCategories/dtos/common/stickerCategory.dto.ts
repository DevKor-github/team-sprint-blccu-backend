import { OmitType } from '@nestjs/swagger';
import { StickerCategory } from '../../entities/stickerCategory.entity';

export class StickerCategoryDto extends OmitType(StickerCategory, [
  'stickerCategoryMappers',
]) {}
