import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserInput {
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  kakaoId: number;
}
