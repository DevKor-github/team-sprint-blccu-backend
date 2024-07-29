import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ArticlesCreateController } from '../controllers/articles-create.controller';
import { ArticleCreateResponseDto } from '../dtos/response/article-create-response.dto';
import { HttpCode } from '@nestjs/common';
import { ArticlesCreateService } from '../services/articles-create.service';
import { ImageUploadRequestDto } from '@/modules/images/dtos/image-upload-request.dto';
import { ImageUploadResponseDto } from '@/modules/images/dtos/image-upload-response.dto';

type ArticlesCreateEndpoints = MethodNames<ArticlesCreateController>;

const ArticlesCreateDocsMap: Record<
  ArticlesCreateEndpoints,
  MethodDecorator[]
> = {
  publishArticle: [
    ApiOperation({
      summary: '게시글 등록',
      description: '게시글을 등록한다.',
    }),
    ApiAuthResponse(),
    ApiCreatedResponse({
      description: '등록 성공',
      type: ArticleCreateResponseDto,
    }),
    HttpCode(201),
    ApiResponseFromMetadata([
      { service: ArticlesCreateService, methodName: 'save' },
    ]),
  ],
  createDraft: [
    ApiOperation({
      summary: '게시글 임시등록',
      description: '게시글을 임시등록한다.',
    }),
    ApiAuthResponse(),
    ApiCreatedResponse({
      description: '임시등록 성공',
      type: ArticleCreateResponseDto,
    }),
    HttpCode(201),
    ApiResponseFromMetadata([
      { service: ArticlesCreateService, methodName: 'createDraft' },
    ]),
  ],
  uploadImage: [
    ApiOperation({
      summary: '이미지 업로드',
      description:
        '이미지를 서버에 업로드한다. url을 반환 받는다. 게시글 내부 이미지 업로드 및 캡처 이미지 업로드용. max_width=1280px',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '업로드 할 파일',
      type: ImageUploadRequestDto,
    }),
    ApiCreatedResponse({
      description: '이미지 서버에 파일 업로드 완료',
      type: ImageUploadResponseDto,
    }),
    HttpCode(201),
    ApiResponseFromMetadata([
      { service: ArticlesCreateService, methodName: 'imageUpload' },
    ]),
  ],
};

export const ArticlesCreateDocs = applyDocs(ArticlesCreateDocsMap);
