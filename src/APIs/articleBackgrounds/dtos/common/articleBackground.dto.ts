import { OmitType } from '@nestjs/swagger';
import { ArticleBackground } from '../../entities/articleBackground.entity';

export class ArticleBackgroundDto extends OmitType(ArticleBackground, [
  'articles',
]) {}
