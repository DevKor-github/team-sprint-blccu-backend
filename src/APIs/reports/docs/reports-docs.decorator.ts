import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { HttpCode } from '@nestjs/common';
import { ReportsController } from '../reports.controller';
import { ReportDto } from '../dtos/common/report.dto';
import { ReportsService } from '../reports.service';

type ReportsEndpoints = MethodNames<ReportsController>;

const ReportsDocsMap: Record<ReportsEndpoints, MethodDecorator[]> = {
  reportArticle: [
    ApiTags('게시글 API'),
    ApiOperation({
      summary: '게시물 신고',
    }),
    ApiAuthResponse(),
    HttpCode(201),
    ApiCreatedResponse({ type: ReportDto }),
    ApiResponseFromMetadata([
      { service: ReportsService, methodName: 'createReport' },
    ]),
  ],
  reportComment: [
    ApiTags('게시글 API'),
    ApiOperation({
      summary: '댓글 신고',
    }),
    ApiAuthResponse(),
    ApiCreatedResponse({ type: ReportDto }),
    HttpCode(201),
    ApiResponseFromMetadata([
      { service: ReportsService, methodName: 'createReport' },
    ]),
  ],
  fetchAll: [
    ApiTags('어드민 API'),
    ApiTags('유저 API'),
    ApiOperation({
      summary: '[어드민용] 신고 내역 조회',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: [ReportDto] }),
    ApiResponseFromMetadata([
      { service: ReportsService, methodName: 'findReports' },
    ]),
  ],
};

export const ReportsDocs = applyDocs(ReportsDocsMap);
