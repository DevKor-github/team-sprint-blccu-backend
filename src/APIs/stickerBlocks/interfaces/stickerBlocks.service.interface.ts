import { StickerBlockCreateRequestDto } from '../dtos/request/stickerBlock-create-request.dto';
import { StickerBlocksCreateRequestDto } from '../dtos/request/stickerBlocks-create-request.dto';

export interface IStikcerBlocksServiceFetchBlocks {
  articleId: number;
}

export interface IStikcerBlocksServiceDeleteBlocks {
  userId: number;
  articleId: number;
}
export interface IStickerBlocksServiceCreateStickerBlock
  extends StickerBlockCreateRequestDto {
  stickerId: number;
  articleId: number;
}
export interface IStickerBlocksServiceCreateStickerBlocks
  extends StickerBlocksCreateRequestDto {
  articleId: number;
}
