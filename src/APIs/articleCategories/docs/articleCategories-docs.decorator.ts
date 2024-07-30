import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { HttpCode } from '@nestjs/common';
import { ArticleCategoriesController } from '../articleCategories.controller';
import { ArticleCategoriesResponseDto } from '../dtos/response/articleCategories-response.dto';
import { ArticleCategoryDto } from '../dtos/common/articleCategory.dto';
import { ArticleCategoriesService } from '../articleCategories.service';

type ArticleCategoriesEndpoints = MethodNames<ArticleCategoriesController>;

const ArticleCategoriesDocsMap: Record<
  ArticleCategoriesEndpoints,
  MethodDecorator[]
> = {
  fetchArticleCategories: [
    ApiOperation({
      summary: '특정 유저의 카테고리 전체 조회',
      description:
        '특정 유저가 생성한 카테고리의 이름과 id, 게시글 개수를 조회한다.',
    }),
    ApiOkResponse({
      type: [ArticleCategoriesResponseDto],
    }),
    HttpCode(200),
  ],
  fetchMyCategory: [
    ApiOperation({
      summary: '특정 카테고리 조회',
      description: 'id에 해당하는 카테고리를 조회한다.',
    }),
    ApiOkResponse({ type: ArticleCategoryDto }),
    ApiResponseFromMetadata([
      {
        service: ArticleCategoriesService,
        methodName: 'findArticleCategoryById',
      },
    ]),
  ],
  createArticleCategory: [
    ApiOperation({
      summary: '게시글 카테고리 생성',
      description: '로그인된 유저와 연결된 카테고리를 생성한다.',
    }),
    ApiAuthResponse(),
    ApiCreatedResponse({
      description: '카테고리 생성 완료',
      type: ArticleCategoryDto,
    }),
    HttpCode(201),
    ApiResponseFromMetadata([
      {
        service: ArticleCategoriesService,
        methodName: 'createArticleCategory',
      },
    ]),
  ],
  patchArticleCategory: [
    ApiOperation({ summary: '로그인된 유저의 특정 카테고리 수정' }),
    ApiAuthResponse(),
    ApiOkResponse({ type: ArticleCategoryDto }),
    ApiResponseFromMetadata([
      { service: ArticleCategoriesService, methodName: 'patchArticleCategory' },
    ]),
  ],
  deleteArticleCategory: [
    ApiOperation({
      summary: '유저의 지정 카테고리 삭제하기',
      description:
        '로그인된 유저의 카테고리 중 articleCategoryId 일치하는 카테고리를 삭제한다',
    }),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      {
        service: ArticleCategoriesService,
        methodName: 'deleteArticleCategory',
      },
    ]),
  ],
};

export const ArticleCategoriesDocs = applyDocs(ArticleCategoriesDocsMap);
