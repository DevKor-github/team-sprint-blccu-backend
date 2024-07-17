import { ApiProperty } from '@nestjs/swagger';
import { ArticleDetailResponseDto } from './article-detail-response.dto';
import { StickerBlocksWithStickerResponseDto } from 'src/APIs/stickerBlocks/dtos/response/stickerBlocks-with-sticker-response.dto';

export class ArticleDetailForUpdateResponseDto {
  @ApiProperty({ type: ArticleDetailResponseDto })
  article: ArticleDetailResponseDto;

  @ApiProperty({ type: [StickerBlocksWithStickerResponseDto] })
  stickerBlocks: StickerBlocksWithStickerResponseDto[];
}
