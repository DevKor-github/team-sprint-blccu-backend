import { PickType } from '@nestjs/swagger';
import { ArticleCategoryDto } from './articleCategory.dto';

export class PatchArticleCategoryInput extends PickType(ArticleCategoryDto, [
  'name',
]) {}
