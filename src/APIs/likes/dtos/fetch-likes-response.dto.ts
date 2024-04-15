import { Likes } from '../entities/like.entity';
import { PickType } from '@nestjs/swagger';

export class FetchLikesResponseDto extends PickType(Likes, ['id', 'user']) {}
