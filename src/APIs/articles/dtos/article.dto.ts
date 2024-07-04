import { OmitType } from '@nestjs/swagger';
import { Article } from '../entities/article.entity';

export class ArticleDto extends OmitType(Article, [
  'comments',
  'user',
  'stickerBlocks',
  'reports',
  'notifications',
  'articleCategory',
  'articleBackground',
]) {}
