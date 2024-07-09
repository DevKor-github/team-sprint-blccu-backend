import { ApiProperty } from '@nestjs/swagger';
import { ArticleDto } from '../common/article.dto';
import { StickerBlockDto } from 'src/APIs/stickerBlocks/dtos/common/stickerBlock.dto';

export class ArticleCreateResponseDto {
  @ApiProperty({ type: ArticleDto })
  articleData: ArticleDto;

  @ApiProperty({ type: [StickerBlockDto] })
  stickerBlockData: StickerBlockDto[];
}
