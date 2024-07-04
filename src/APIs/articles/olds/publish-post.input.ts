import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BulkInsertStickerInput } from 'src/APIs/stickerBlocks/dtos/create-stickerBlocks.dto';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import { IsBoolean } from 'src/common/validators/isBoolean';

export class PublishPostInput {
  @ApiProperty({ type: [BulkInsertStickerInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkInsertStickerInput)
  stickerBlocks: BulkInsertStickerInput[];

  @ApiProperty({
    description: '연결된 카테고리 fk',
    type: String,
  })
  @IsString()
  postCategoryId: string;

  @ApiProperty({
    description: '연결된 내지 fk',
    type: String,
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  postBackgroundId?: string;

  @ApiProperty({
    description: '제목(최대 100자)',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({ description: '수정용 제목', type: String })
  @IsString()
  title_html: string;

  @ApiProperty({
    description: '댓글 허용 여부(boolean)',
    type: Boolean,
  })
  @IsBoolean()
  allow_comment: boolean;

  @ApiProperty({
    description:
      '[공개 설정] PUBLIC: 전체공개, PROTECTED: 친구공개, PRIVATE: 비공개',
    type: 'enum',
    enum: OpenScope,
  })
  @IsEnum(OpenScope)
  scope: OpenScope;

  @ApiProperty({ description: '게시글 내용', type: String })
  @IsString()
  content: string;

  @ApiProperty({ description: '게시글 설명(html 태그 제외)', type: String })
  main_description: string;

  @ApiProperty({ description: '게시글 캡쳐 이미지 url', type: String })
  @IsString()
  image_url: string;

  @ApiProperty({ description: '게시글 대표 이미지 url', type: String })
  @IsString()
  main_image_url: string;
}