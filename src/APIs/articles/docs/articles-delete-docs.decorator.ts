import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { ApiOperation } from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ArticlesDeleteController } from '../controllers/articles-delete.controller';
import { ArticlesDeleteService } from '../services/articles-delete.service';

type ArticlesDeleteEndpoints = MethodNames<ArticlesDeleteController>;

const ArticlesDeleteDocsMap: Record<
  ArticlesDeleteEndpoints,
  MethodDecorator[]
> = {
  softDelete: [
    ApiOperation({
      summary: '게시글 삭제',
      description:
        '로그인 된 유저의 postId에 해당하는 게시글을 삭제한다. isHardDelete(nullable)을 통해 삭제 방식 결정',
    }),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      { service: ArticlesDeleteService, methodName: 'softDelete' },
      { service: ArticlesDeleteService, methodName: 'hardDelete' },
    ]),
  ],
};

export const ArticlesDeleteDocs = applyDocs(ArticlesDeleteDocsMap);
