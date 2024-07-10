import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUrl, ValidateNested } from 'class-validator';
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
  'mainImageUrl',
]) {
  @ApiProperty({ type: [StickerBlocksCreateDto] })
  @IsArray({ message: 'stickerBlocks는 배열이여야 합니다.' })
  @ValidateNested({ each: true })
  @Type(() => StickerBlocksCreateDto)
  @IsOptional()
  stickerBlocks: StickerBlocksCreateDto[];

  @ApiProperty({
    description: '게시글 대표 이미지 url',
    type: String,
    required: false,
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  mainImageUrl?: string | null;
}
