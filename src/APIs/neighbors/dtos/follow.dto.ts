import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FollowDto {
  @ApiProperty({ type: Number, example: 3388766789, description: '카카오 id' })
  @IsNotEmpty()
  follow_id: number;
}
