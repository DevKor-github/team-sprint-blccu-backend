import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OpenScope } from 'src/commons/enums/open-scope.enum';

export class PublishPostInput {
  @ApiProperty({
    description: '포스트의 고유 아이디',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: '연결된 카테고리 fk',
    type: String,
  })
  @IsString()
  postCategoryId: string;

  @ApiProperty({ description: '연결된 내지 fk', type: String })
  @IsString()
  postBackgroundId: string;

  @ApiProperty({
    description: '제목(최대 100자)',
    type: String,
  })
  @IsString()
  title: string;

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
  scope?: OpenScope;

  @ApiProperty({ description: '게시글 내용', type: String })
  @IsString()
  content: string;

  @ApiProperty({ description: '게시글 캡쳐 이미지 url', type: String })
  @IsString()
  image_url: string;

  @ApiProperty({ description: '게시글 대표 이미지 url', type: String })
  @IsString()
  main_image_url: string;
}
