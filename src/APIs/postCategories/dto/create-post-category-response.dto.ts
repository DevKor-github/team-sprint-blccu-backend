import { ApiProperty } from '@nestjs/swagger';

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
  user: number;
}
