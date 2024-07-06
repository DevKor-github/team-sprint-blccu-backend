import { ApiProperty, PickType } from '@nestjs/swagger';
import { NotificationDto } from '../common/notification.dto';
import { UserDto } from 'src/APIs/users/dtos/common/user.dto';

export class NotificationsGetResponseDto extends NotificationDto {
  @ApiProperty({
    type: PickType(UserDto, ['username', 'profileImage', 'handle']),
  })
  user: Pick<UserDto, 'username' | 'profileImage' | 'handle'>;
}
