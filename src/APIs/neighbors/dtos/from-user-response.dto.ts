import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserResponseDto } from 'src/APIs/users/dtos/user-response.dto';
import { Neighbor } from '../entities/neighbor.entity';

export class FromUserResponseDto extends OmitType(Neighbor, [
  'from_user',
  'to_user',
]) {
  @ApiProperty({
    type: UserResponseDto,
  })
  from_user: UserResponseDto;
}
