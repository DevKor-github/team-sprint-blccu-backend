import { ApiProperty, OmitType } from '@nestjs/swagger';

import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/response/user-primary-response.dto';
import { ArticleDto } from '../common/article.dto';
import { ArticleCategoryDto } from 'src/APIs/articleCategories/dtos/common/articleCategory.dto';
import { ArticleBackgroundDto } from 'src/APIs/articleBackgrounds/dtos/common/articleBackground.dto';

export class ArticleDetailResponseDto extends OmitType(ArticleDto, []) {
  @ApiProperty({ description: '작성자의 정보', type: UserPrimaryResponseDto })
  user: UserPrimaryResponseDto;

  @ApiProperty({ description: '카테고리 정보', type: ArticleCategoryDto })
  articleCategory: ArticleCategoryDto;

  @ApiProperty({ description: '배경 정보', type: ArticleBackgroundDto })
  articleBackground: ArticleBackgroundDto;
}
