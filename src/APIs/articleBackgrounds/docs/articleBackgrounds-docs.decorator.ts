import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ArticleBackgroundsController } from '../articleBackgrounds.controller';
import { ImageUploadRequestDto } from '@/modules/images/dtos/image-upload-request.dto';
import { ImageUploadResponseDto } from '@/modules/images/dtos/image-upload-response.dto';
import { ArticleBackgroundDto } from '../dtos/common/articleBackground.dto';
import { ArticleBackgroundsService } from '../articleBackgrounds.service';

type ArticleBackgroundsEndpoints = MethodNames<ArticleBackgroundsController>;

const ArticleBackgroundsDocsMap: Record<
  ArticleBackgroundsEndpoints,
  MethodDecorator[]
> = {
  createArticleBackground: [
    ApiTags('어드민 API'),
    ApiOperation({ summary: '내지 업로드' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '업로드 할 파일',
      type: ImageUploadRequestDto,
    }),
    ApiCreatedResponse({
      description: '이미지 서버에 파일 업로드 완료',
      type: ImageUploadResponseDto,
    }),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      {
        service: ArticleBackgroundsService,
        methodName: 'createArticleBackground',
      },
    ]),
  ],
  getArticleBackgrounds: [
    ApiTags('게시글 API'),
    ApiOperation({ summary: '내지 모두 불러오기' }),
    ApiOkResponse({
      description: '모든 내지 fetch 완료',
      type: [ArticleBackgroundDto],
    }),
    ApiResponseFromMetadata([
      {
        service: ArticleBackgroundsService,
        methodName: 'findArticleBackgrounds',
      },
    ]),
  ],
  delete: [
    ApiAuthResponse(),
    ApiTags('어드민 API'),
    ApiOperation({ summary: '내지 삭제하기' }),
    ApiResponseFromMetadata([
      {
        service: ArticleBackgroundsService,
        methodName: 'deleteArticleBackground',
      },
    ]),
  ],
};

export const ArticleBackgroundsDocs = applyDocs(ArticleBackgroundsDocsMap);
