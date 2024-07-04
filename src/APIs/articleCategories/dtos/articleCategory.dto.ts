import { OmitType } from '@nestjs/swagger';
import { ArticleCategory } from '../entities/articleCategory.entity';

export class ArticleCategoryDto extends OmitType(ArticleCategory, [
  'user',
  'articles',
]) {}
