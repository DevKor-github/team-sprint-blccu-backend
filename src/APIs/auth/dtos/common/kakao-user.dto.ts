import { ApiProperty } from '@nestjs/swagger';

export class KakaoUserDto {
  @ApiProperty()
  userId: number;
}
