import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeDto {
  @ApiProperty({ type: Number, description: 'post_id' })
  id: number;
}
