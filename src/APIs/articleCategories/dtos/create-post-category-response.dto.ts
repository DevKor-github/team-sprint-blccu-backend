import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/APIs/users/entities/user.entity';

export class CreatePostCategoryResponseDto {
  @ApiProperty({
    type: String,
    description: 'PK: uuid',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: '카테고리 이름',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: '유저 kakaoId',
  })
  userKakaoId: number;

  @ApiProperty({
    type: PickType(User, ['kakaoId']),
    description: '유저의 picktype',
  })
  user: User;
}
