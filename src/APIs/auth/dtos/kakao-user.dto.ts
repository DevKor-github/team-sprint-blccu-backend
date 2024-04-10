import { ApiProperty } from '@nestjs/swagger';

export class KakaoUserDto {
  @ApiProperty()
  kakaoId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  profile_image: string;
}
