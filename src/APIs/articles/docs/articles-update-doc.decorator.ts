import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ArticlesUpdateController } from '../controllers/articles-update.controller';
import { HttpCode } from '@nestjs/common';
import { ArticleDto } from '../dtos/common/article.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ArticlesUpdateService } from '../services/articles-update.service';

type ArticlesUpdateEndpoints = MethodNames<ArticlesUpdateController>;

const ArticlesUpdateDocsMap: Record<
  ArticlesUpdateEndpoints,
  MethodDecorator[]
> = {
  patchArticle: [
    ApiOperation({ summary: '게시글 patch' }),
    ApiAuthResponse(),
    HttpCode(200),
    ApiOkResponse({ type: ArticleDto }),
    ApiResponseFromMetadata([
      { service: ArticlesUpdateService, methodName: 'patchArticle' },
    ]),
  ],
};

export const ArticlesUpdateDocs = applyDocs(ArticlesUpdateDocsMap);
