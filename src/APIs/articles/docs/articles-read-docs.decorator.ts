import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ArticlesReadController } from '../controllers/articles-read.controller';
import { ArticleDetailResponseDto } from '../dtos/response/article-detail-response.dto';
import { ArticleDetailForUpdateResponseDto } from '../dtos/response/article-detail-for-update-response.dto';
import { ArticlesGetResponseDto } from '../dtos/response/articles-get-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ArticlesReadService } from '../services/articles-read.service';
import { ArticlesPaginateService } from '../services/articles-paginate.service';

type ArticlesReadEndpoints = MethodNames<ArticlesReadController>;

const ArticlesReadDocsMap: Record<ArticlesReadEndpoints, MethodDecorator[]> = {
  fetchTempArticles: [
    ApiOperation({
      summary: '임시작성 게시글 조회',
      description: '로그인된 유저의 임시작성 게시글을 조회한다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: [ArticleDetailResponseDto] }),
    ApiResponseFromMetadata([
      { service: ArticlesReadService, methodName: 'readTempArticles' },
    ]),
  ],
  fetchArticleDetail: [
    ApiOperation({
      summary: '게시글 디테일 뷰 fetch',
      description:
        'id에 해당하는 게시글을 가져온다. 조회수를 올린다. 보호된 게시글은 권한이 있는 사용자만 접근 가능하다.',
    }),
    ApiOkResponse({ type: ArticleDetailResponseDto }),
    ApiResponseFromMetadata([
      { service: ArticlesReadService, methodName: 'readArticleDetail' },
    ]),
  ],
  fetchArticle: [
    ApiOperation({
      summary: '[수정용] 게시글 및 스티커 상세 데이터 fetch',
      description:
        '본인 게시글 수정용으로 id에 해당하는 게시글에 조인된 스티커 블록들의 값과 게시글 세부 데이터를 모두 가져온다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: ArticleDetailForUpdateResponseDto }),
    ApiResponseFromMetadata([
      { service: ArticlesReadService, methodName: 'readArticleUpdateDetail' },
    ]),
  ],
  fetchCursor: [
    ApiOperation({
      summary: '[cursor]전체 게시글 조회 API',
      description:
        '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다. PUBLIC 게시글만 조회한다.',
    }),
    ApiOkResponse({ type: ArticlesGetResponseDto }),
    ApiResponseFromMetadata([
      { service: ArticlesPaginateService, methodName: 'createDefaultCursor' },
      { service: ArticlesPaginateService, methodName: 'createDefaultCursor' },
    ]),
  ],
  fetchFriendsCursor: [
    ApiOperation({
      summary: '[cursor]친구 게시글 조회 API',
      description:
        '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: ArticlesGetResponseDto }),
    ApiResponseFromMetadata([
      { service: ArticlesPaginateService, methodName: 'createDefaultCursor' },
      {
        service: ArticlesPaginateService,
        methodName: 'fetchFriendsArticlesCursor',
      },
    ]),
  ],
  fetchUserArticles: [
    ApiOperation({
      summary: '[cursor]특정 유저의 게시글 조회',
      description:
        '로그인 된 유저의 경우 private/protected 게시글 조회 권한 체크 후 조회. 카테고리 이름으로 필터링 가능',
    }),
    ApiOkResponse({ type: ArticlesGetResponseDto }),
    ApiResponseFromMetadata([
      { service: ArticlesPaginateService, methodName: 'createDefaultCursor' },
      {
        service: ArticlesPaginateService,
        methodName: 'fetchUserArticlesCursor',
      },
    ]),
  ],
};

export const ArticlesReadDocs = applyDocs(ArticlesReadDocsMap);
