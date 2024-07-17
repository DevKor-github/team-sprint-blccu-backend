import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/response/user-primary-response.dto';
import { ArticleDto } from './article.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleWithUserDto extends ArticleDto {
  @ApiProperty({ description: '작성자의 정보', type: UserPrimaryResponseDto })
  user: UserPrimaryResponseDto;
}
