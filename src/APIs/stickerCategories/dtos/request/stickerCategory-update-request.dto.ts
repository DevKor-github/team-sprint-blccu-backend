import { PickType } from '@nestjs/swagger';
import { StickerCategoryDto } from '../common/stickerCategory.dto';

export class StickerCategoryUpdateRequestDto extends PickType(
  StickerCategoryDto,
  ['name'],
) {}
