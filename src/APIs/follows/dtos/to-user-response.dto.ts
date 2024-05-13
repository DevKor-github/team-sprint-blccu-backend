import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserResponseDto } from 'src/APIs/users/dtos/user-response.dto';
import { Follow } from '../entities/follow.entity';

export class ToUserResponseDto extends OmitType(Follow, [
  'from_user',
  'to_user',
]) {
  @ApiProperty({
    type: UserResponseDto,
  })
  to_user: UserResponseDto;
}