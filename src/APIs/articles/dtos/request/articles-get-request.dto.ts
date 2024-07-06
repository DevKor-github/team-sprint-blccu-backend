import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ArticleOrderOptionWrap } from 'src/common/enums/article-order-option';
import { DateOption } from 'src/common/enums/date-option';
import { CustomCursorPageOptionsDto } from 'src/modules/utils/cursor-pages/dtos/cursor-page-option.dto';

export class ArticlesGetRequestDto extends CustomCursorPageOptionsDto {
  @ApiProperty({
    description: '정렬 옵션',
    type: 'enum',
    enum: ArticleOrderOptionWrap,
    required: false,
    default: ArticleOrderOptionWrap.DATE,
  })
  order?: ArticleOrderOptionWrap = ArticleOrderOptionWrap.DATE;

  @ApiProperty({
    type: 'enun',
    enum: DateOption,
    description: '특정 기간 이후 게시글 조회, null 일 경우 전체 조회',
    required: false,
    default: null,
  })
  @IsEnum(DateOption)
  @IsOptional()
  dateCreated?: DateOption;
}
