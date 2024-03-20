import { Likes } from '../entities/like.entity';
import { PickType } from '@nestjs/swagger';

export class FetchLikesResponseDto extends PickType(Likes, ['id', 'user']) {
  //   @ApiProperty({ description: '포스트 아이디', type: Number })
  //   post: number;
}
