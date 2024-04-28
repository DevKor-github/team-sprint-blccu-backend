import { OmitType } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';
export class EmitNotDto extends OmitType(Notification, [
  'user',
  'id',
  'targetUser',
  'date_created',
  'date_deleted',
]) {}

export class EmitNotInput extends OmitType(EmitNotDto, ['userKakaoId']) {}
