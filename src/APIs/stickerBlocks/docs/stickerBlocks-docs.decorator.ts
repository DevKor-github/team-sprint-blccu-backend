import { MethodNames } from '@/common/types/method';
import { applyDocs } from '@/utils/docs.utils';
import { StickerBlocksController } from '../stickerBlocks.controller';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { StickerBlockDto } from '../dtos/common/stickerBlock.dto';
import { StickerBlocksService } from '../stickerBlocks.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiAuthResponse } from '@/common/decorators/api-auth-response.dto';
type StickerBlocksEndpoints = MethodNames<StickerBlocksController>;
const StickerBlocksDocsMap: Record<StickerBlocksEndpoints, MethodDecorator[]> =
  {
    createStickerBlocks: [
      ApiOperation({
        summary: '게시글 속 스티커 생성',
        description:
          '게시글과 스티커 아이디를 매핑한 스티커 블록을 생성한다. 세부 스타일 좌표값을 저장한다.',
      }),
      ApiAuthResponse(),
      ApiCreatedResponse({ type: [StickerBlockDto] }),
      ApiResponseFromMetadata([
        { service: StickerBlocksService, methodName: 'createStickerBlocks' },
      ]),
    ],
  };

export const StickerBlocksDocs = applyDocs(StickerBlocksDocsMap);
