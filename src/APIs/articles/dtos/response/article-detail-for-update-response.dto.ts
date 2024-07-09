import { ApiProperty } from '@nestjs/swagger';
import { ArticleDetailResponseDto } from './article-detail-response.dto';
import { StickerBlockDto } from 'src/APIs/stickerBlocks/dtos/common/stickerBlock.dto';

export class ArticleDetailForUpdateResponseDto {
  @ApiProperty({ type: ArticleDetailResponseDto })
  article;

  @ApiProperty({ type: [StickerBlockDto] })
  stickerBlocks;
}
