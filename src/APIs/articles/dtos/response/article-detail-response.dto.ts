import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Article } from '../../entities/article.entity';
import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/response/user-primary-response.dto';

export class ArticleDetailResponseDto extends OmitType(Article, [
  'comments',
  'user',
  'stickerBlocks',
  'reports',
  'notifications',
]) {
  @ApiProperty({ description: '작성자의 정보', type: UserPrimaryResponseDto })
  user: UserPrimaryResponseDto;
}
