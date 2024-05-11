import { ApiProperty } from '@nestjs/swagger';

export class FollowUserDto {
  @ApiProperty({ type: String, description: 'PK: uuid' })
  id: string;

  @ApiProperty({ type: Number, description: 'FK: kakaoId' })
  to_user: string;

  @ApiProperty({ type: Number, description: 'FK: kakaoId' })
  from_user: string;
}
