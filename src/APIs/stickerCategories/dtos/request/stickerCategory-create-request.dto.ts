import { PickType } from '@nestjs/swagger';
import { StickerCategoryDto } from '../common/stickerCategory.dto';

export class StickerCategoryCreateRequestDto extends PickType(
  StickerCategoryDto,
  ['name'],
) {}
