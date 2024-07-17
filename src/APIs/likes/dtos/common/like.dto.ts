import { OmitType } from '@nestjs/swagger';
import { Like } from '../../entities/like.entity';

export class LikeDto extends OmitType(Like, ['article', 'user']) {}
