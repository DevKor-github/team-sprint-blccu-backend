import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/APIs/users/dto/user-response.dto';

export class FromUserResponseDto {
  @ApiProperty({
    type: String,
    example: 'b6993606-1992-427e-bf73-c3fc778a48ff',
  })
  id: string;

  @ApiProperty({
    type: UserResponseDto,
  })
  from_user: UserResponseDto;
}
