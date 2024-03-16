import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FollowDto {
  @ApiProperty({ type: Number, example: 3388766789 })
  @IsNotEmpty()
  follow_id: number;
}
