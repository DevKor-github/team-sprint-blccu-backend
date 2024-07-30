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
import { AnnouncementsController } from '../announcements.controller';
import { AnnouncementsService } from '../announcements.service';
import { AnnouncementDto } from '../dtos/common/announcement.dto';
import { HttpCode } from '@nestjs/common';

type AnnouncementsEndpoints = MethodNames<AnnouncementsController>;

const AnnouncementsDocsMap: Record<AnnouncementsEndpoints, MethodDecorator[]> =
  {
    createAnnouncement: [
      HttpCode(201),
      ApiTags('어드민 API'),
      ApiOperation({ summary: '[어드민용] 공지사항 작성' }),
      ApiAuthResponse(),
      ApiCreatedResponse({ type: AnnouncementDto }),
      ApiResponseFromMetadata([
        { service: AnnouncementsService, methodName: 'createAnnoucement' },
      ]),
    ],
    getAnnouncements: [
      ApiOperation({ summary: '공지사항 조회' }),
      ApiOkResponse({ type: [AnnouncementDto] }),
      ApiResponseFromMetadata([
        { service: AnnouncementsService, methodName: 'getAnnouncements' },
      ]),
    ],
    patchAnnouncement: [
      ApiTags('어드민 API'),
      ApiOperation({ summary: '[어드민용] 공지사항 수정' }),
      ApiAuthResponse(),
      ApiOkResponse({ type: AnnouncementDto }),
      ApiResponseFromMetadata([
        { service: AnnouncementsService, methodName: 'patchAnnouncement' },
      ]),
    ],
    removeAnnouncement: [
      ApiTags('어드민 API'),
      ApiOperation({
        summary: '[어드민용] 공지사항 삭제',
        description: 'id에 해당하는 공지사항 삭제, 삭제된 공지사항을 반환',
      }),
      ApiAuthResponse(),
      ApiOkResponse({ type: AnnouncementDto }),
      ApiResponseFromMetadata([
        { service: AnnouncementsService, methodName: 'removeAnnouncement' },
      ]),
    ],
  };

export const AnnouncementsDocs = applyDocs(AnnouncementsDocsMap);
