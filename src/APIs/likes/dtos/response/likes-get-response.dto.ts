import { LikeDto } from '../common/like.dto';
import { PickType } from '@nestjs/swagger';

export class LikesGetResponseDto extends PickType(LikeDto, [
  'id',
  'articleId',
  'userId',
]) {}
