import { ApiProperty, OmitType } from '@nestjs/swagger';

import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/user-response.dto';
import { Posts } from '../entities/article.entity';

export class PostResponseDto extends OmitType(Posts, ['user']) {
  @ApiProperty({ description: '작성자의 정보', type: UserPrimaryResponseDto })
  user: UserPrimaryResponseDto;
}

export class PostOnlyResponseDto extends OmitType(Posts, [
  'user',
  'postBackground',
  'postCategory',
]) {}
