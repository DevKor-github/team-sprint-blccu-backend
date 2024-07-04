import { PickType } from '@nestjs/swagger';
import { ArticleCategoryDto } from './articleCategory.dto';

export class CreateArticleCategoryInput extends PickType(ArticleCategoryDto, [
  'name',
]) {}

export class CreateArticleCategoryResponse extends ArticleCategoryDto {}
