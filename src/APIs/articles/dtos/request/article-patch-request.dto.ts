import { PartialType } from '@nestjs/swagger';
import { ArticleCreateRequestDto } from './article-create-request.dto';

export class ArticlePatchRequestDto extends PartialType(
  ArticleCreateRequestDto,
) {}
