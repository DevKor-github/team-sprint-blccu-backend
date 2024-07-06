import { PartialType } from '@nestjs/swagger';
import { ArticleCreateRequestDto } from './article-create-request.dto';
import { StickerBlocksCreateDto } from 'src/APIs/stickerBlocks/dtos/common/stickerBlocks.create.dto';

export class ArticleCreateDraftRequestDto extends PartialType(
  ArticleCreateRequestDto,
) {
  stickerBlocks: StickerBlocksCreateDto[];
}
