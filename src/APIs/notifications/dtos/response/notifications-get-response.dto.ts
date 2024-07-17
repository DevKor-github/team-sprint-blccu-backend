import { ApiProperty, PickType } from '@nestjs/swagger';
import { NotificationDto } from '../common/notification.dto';
import { UserDto } from 'src/APIs/users/dtos/common/user.dto';
import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/response/user-primary-response.dto';

export class NotificationsGetResponseDto extends NotificationDto {
  @ApiProperty({
    type: PickType(UserDto, ['username', 'profileImage', 'handle']),
  })
  user: UserPrimaryResponseDto;
}
