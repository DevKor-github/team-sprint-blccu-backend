import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/APIs/users/dtos/user-response.dto';

export class ToUserResponseDto {
  @ApiProperty({
    type: String,
    example: 'b6993606-1992-427e-bf73-c3fc778a48ff',
  })
  id: string;

  @ApiProperty({
    type: UserResponseDto,
  })
  to_user: UserResponseDto;
}
