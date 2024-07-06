import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../common/user.dto';

export class UserFollowingResponseDto extends UserDto {
  @ApiProperty({ type: Boolean, description: '팔로잉 유무' })
  isFollowing: boolean;
}
