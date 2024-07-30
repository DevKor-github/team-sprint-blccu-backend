import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { StickerCategoriesController } from '../stickerCategories.controller';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { StickerCategoriesService } from '../stickerCategories.service';
import { StickerCategoryDto } from '../dtos/common/stickerCategory.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StickersCategoryFetchStickersResponseDto } from '../dtos/response/stickerCategories-fetch-stickers-response.dto';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { StickerCategoryMapperDto } from '../dtos/common/stickerCategoryMapper.dto';

type StickerCategoriesEndpoints = MethodNames<StickerCategoriesController>;
const StickerCategoriesDocsMap: Record<
  StickerCategoriesEndpoints,
  MethodDecorator[]
> = {
  fetchCategories: [
    ApiOperation({
      summary: '카테고리 fetchAll',
      description: '카테고리를 모두 조회한다.',
    }),
    ApiOkResponse({ type: [StickerCategoryDto] }),
  ],
  fetchStickersByCategoryName: [
    ApiOperation({
      summary: '카테고리 id에 해당하는 스티커를 fetchAll',
      description: '카테고리를 id로 찾고, 이에 매핑된 스티커들을 가져온다',
    }),
    ApiOkResponse({ type: [StickersCategoryFetchStickersResponseDto] }),
    ApiResponseFromMetadata([
      {
        service: StickerCategoriesService,
        methodName: 'fetchStickersByCategoryId',
      },
    ]),
  ],
  createCategory: [
    ApiTags('어드민 API'),
    ApiOperation({
      summary: '[어드민용] 스티커 카테고리 생성',
      description: '[어드민 전용] 스티커 카테고리를 만든다.',
    }),
    ApiOkResponse({ type: StickerCategoryDto }),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      {
        service: StickerCategoriesService,
        methodName: 'createCategory',
      },
    ]),
  ],
  mapCategory: [
    ApiTags('어드민 API'),
    ApiOperation({
      summary: '[어드민용] 스티커와 카테고리 매핑',
      description: '[어드민 전용] 스티커에 카테고리를 매핑한다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: [StickerCategoryMapperDto] }),
    ApiResponseFromMetadata([
      {
        service: StickerCategoriesService,
        methodName: 'mapCategory',
      },
    ]),
  ],
};

export const StickerCategoriesDocs = applyDocs(StickerCategoriesDocsMap);
