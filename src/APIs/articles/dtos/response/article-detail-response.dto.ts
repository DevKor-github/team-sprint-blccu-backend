import { ApiProperty, OmitType } from '@nestjs/swagger';

import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/user-response.dto';
import { Article } from '../../entities/article.entity';

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
