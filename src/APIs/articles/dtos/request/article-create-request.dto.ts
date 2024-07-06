import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ArticleDto } from '../common/article.dto';
import { StickerBlocksCreateDto } from 'src/APIs/stickerBlocks/dtos/common/stickerBlocks-create.dto';

export class ArticleCreateRequestDto extends OmitType(ArticleDto, [
  'id',
  'commentCount',
  'viewCount',
  'reportCount',
  'likeCount',
  'userId',
  'isPublished',
  'dateCreated',
  'dateDeleted',
  'dateUpdated',
]) {
  @ApiProperty({ type: [StickerBlocksCreateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StickerBlocksCreateDto)
  stickerBlocks: StickerBlocksCreateDto[];
}
