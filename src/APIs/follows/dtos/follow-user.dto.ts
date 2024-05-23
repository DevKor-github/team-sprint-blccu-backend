import { OmitType } from '@nestjs/swagger';
import { Follow } from '../entities/follow.entity';

export class FollowUserDto extends OmitType(Follow, ['from_user', 'to_user']) {}
