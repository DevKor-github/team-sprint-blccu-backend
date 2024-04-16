import { OmitType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export const USER_SELECT_OPTION = {
  kakaoId: true,
  isAdmin: true,
  username: true,
  description: true,
  profile_image: true,
  background_image: true,
  date_created: true,
  date_deleted: true,
};
export const USER_PRIMARY_SELECT_OPTION = {
  kakaoId: true,
  username: true,
  description: true,
  profile_image: true,
};
export class UserPrimaryResponseDto extends PickType(User, [
  'kakaoId',
  'username',
  'profile_image',
  'description',
]) {}
export class UserResponseDto extends OmitType(User, ['current_refresh_token']) {
  // @ApiProperty({ description: '카카오 id', type: Number })
  // kakaoId: number;
  // // @ApiProperty({ description: 'crypted refresh token', type: String })
  // // current_refresh_token: string;
  // @ApiProperty({ description: '어드민 유저 여부', type: Boolean })
  // isAdmin: boolean;
  // @ApiProperty({ description: '유저 이름', type: String })
  // username: string;
  // @ApiProperty({ description: '유저 설명', type: String })
  // description: string;
  // @ApiProperty({ description: '프로필 이미지 url', type: String })
  // profile_image: string;
  // @ApiProperty({ description: '생성된 날짜', type: Date })
  // date_created: Date;
  // @ApiProperty({ description: '삭제된 날짜', type: Date })
  // date_deleted: Date;
}
