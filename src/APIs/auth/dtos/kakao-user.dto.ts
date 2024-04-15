import { ApiProperty } from '@nestjs/swagger';

export class KakaoUserDto {
  @ApiProperty()
  kakaoId: number;
}
