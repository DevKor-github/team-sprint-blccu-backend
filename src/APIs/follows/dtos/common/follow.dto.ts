import { OmitType } from '@nestjs/swagger';
import { Follow } from '../../entities/follow.entity';

export class FollowDto extends OmitType(Follow, ['fromUser', 'toUser']) {}
