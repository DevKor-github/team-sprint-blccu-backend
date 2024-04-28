import { OmitType } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';
export class EmitNotiDto extends OmitType(Notification, [
  'user',
  'id',
  'targetUser',
  'date_created',
  'date_deleted',
]) {}

export class EmitNotiInput extends OmitType(EmitNotiDto, ['userKakaoId']) {}
