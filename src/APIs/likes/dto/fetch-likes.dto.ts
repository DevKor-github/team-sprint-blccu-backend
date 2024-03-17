import { ApiProperty } from '@nestjs/swagger';

export class FetchLikesDto {
  @ApiProperty({ type: Number, description: 'post_id' })
  id: number;
}
