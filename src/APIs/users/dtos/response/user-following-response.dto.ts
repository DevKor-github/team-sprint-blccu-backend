import { ApiProperty } from '@nestjs/swagger';
import { UserPrimaryResponseDto } from './user-primary-response.dto';

export class UserFollowingResponseDto extends UserPrimaryResponseDto {
  @ApiProperty({ type: Boolean, description: '팔로잉 유무' })
  isFollowing: boolean;
}
