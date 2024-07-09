import { PickType } from '@nestjs/swagger';
import { ArticleCategoryDto } from '../common/articleCategory.dto';

export class ArticleCategoryCreateRequestDto extends PickType(
  ArticleCategoryDto,
  ['name'] as const,
) {}
