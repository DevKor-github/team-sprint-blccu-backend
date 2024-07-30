import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StickersController } from '../stickers.controller';
import { StickerDto } from '../dtos/common/sticker.dto';
import { ImageUploadRequestDto } from '@/modules/images/dtos/image-upload-request.dto';
import { HttpCode } from '@nestjs/common';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { StickersService } from '../stickers.service';

type StickersEndpoints = MethodNames<StickersController>;

const StickersDocsMap: Record<StickersEndpoints, MethodDecorator[]> = {
  createPrivateSticker: [
    ApiOperation({
      summary: '[유저용] 개인 스티커를 업로드한다.',
      description: '개인만 조회 가능한 유저용 스티커를 업로드한다.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '업로드 할 파일',
      type: ImageUploadRequestDto,
    }),
    ApiCreatedResponse({
      description: '이미지 서버에 파일 업로드 완료',
      type: StickerDto,
    }),
    HttpCode(201),
    ApiAuthResponse(),
    ApiResponseFromMetadata([
      { service: StickersService, methodName: 'createPrivateSticker' },
    ]),
  ],
  fetchPrivateStickers: [
    ApiOperation({
      summary: '재사용 가능한 private 스티커를 fetch한다.',
      description:
        '본인이 만든 재사용 가능한 스티커들을 fetch한다. toggle이 우선적으로 이루어져야함.',
    }),
    ApiOkResponse({ description: '조회 성공', type: [StickerDto] }),
    ApiAuthResponse(),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: StickersService, methodName: 'findUserStickers' },
    ]),
  ],
  patchSticker: [
    ApiOperation({
      summary: '스티커의 image_url 혹은 재사용 여부를 설정한다.',
      description:
        '본인이 만든 스티커를 patch한다. image_url 변경 시 기존의 이미지는 s3에서 제거된다.',
    }),
    ApiAuthResponse(),
    ApiOkResponse({ type: StickerDto }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: StickersService, methodName: 'updateSticker' },
    ]),
  ],
  fetchPublicStickers: [
    ApiOperation({
      summary: 'public 스티커를 fetch한다.',
      description: '블꾸가 만든 스티커들을 fetch한다.',
    }),
    ApiOkResponse({ description: '조회 성공', type: [StickerDto] }),
    HttpCode(200),
    ApiResponseFromMetadata([
      { service: StickersService, methodName: 'findPublicStickers' },
    ]),
  ],
  createPublicSticker: [
    ApiTags('어드민 API'),
    ApiOperation({
      summary: '[어드민용] 공용 스티커를 업로드한다.',
      description:
        '블꾸에서 제작한 스티커를 업로드한다. 어드민 권한이 있는 유저 전용. 카테고리와 매핑을 해주어야 조회 가능.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '업로드 할 파일',
      type: ImageUploadRequestDto,
    }),
    ApiCreatedResponse({
      description: '이미지 서버에 파일 업로드 완료',
      type: StickerDto,
    }),
    ApiAuthResponse(),
    HttpCode(201),
    ApiResponseFromMetadata([
      { service: StickersService, methodName: 'createPublicSticker' },
    ]),
  ],
  deleteSticker: [
    ApiOperation({ summary: '스티커 삭제', description: '스티커를 삭제한다.' }),
    ApiAuthResponse(),
    ApiNoContentResponse({ description: '삭제 성공' }),
    ApiResponseFromMetadata([
      { service: StickersService, methodName: 'deleteSticker' },
    ]),
  ],
};

export const StickersDocs = applyDocs(StickersDocsMap);
