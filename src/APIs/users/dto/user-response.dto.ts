import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '카카오 id', type: Number })
  kakaoId: number;

  // @ApiProperty({ description: 'crypted refresh token', type: String })
  // current_refresh_token: string;

  @ApiProperty({ description: '어드민 유저 여부', type: Boolean })
  isAdmin?: boolean;

  @ApiProperty({ description: '유저 이름', type: String })
  username?: string;

  @ApiProperty({ description: '유저 설명', type: String })
  description?: string;

  @ApiProperty({ description: '프로필 이미지 url', type: String })
  profile_image?: string;

  @ApiProperty({ description: '생성된 날짜', type: Date })
  date_created?: Date;

  @ApiProperty({ description: '삭제된 날짜', type: Date })
  date_deleted?: Date;
}
