import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DateOption } from 'src/common/enums/date-option';
import { PostsOrderOptionWrap } from 'src/common/enums/article-order-option';
import { CustomCursorPageOptionsDto } from 'src/utils/cursor-pages/dtos/cursor-page-option.dto';

export class CursorFetchPosts extends CustomCursorPageOptionsDto {
  @ApiProperty({
    description: '정렬 옵션',
    type: 'enum',
    enum: PostsOrderOptionWrap,
    required: false,
    default: PostsOrderOptionWrap.DATE,
  })
  order?: PostsOrderOptionWrap = PostsOrderOptionWrap.DATE;

  @ApiProperty({
    type: 'enun',
    enum: DateOption,
    description: '특정 기간 이후 게시글 조회, null 일 경우 전체 조회',
    required: false,
    default: null,
  })
  @IsEnum(DateOption)
  @IsOptional()
  date_created?: DateOption;
}
