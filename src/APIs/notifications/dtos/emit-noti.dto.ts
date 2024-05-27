import { OmitType, PickType } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';
export class EmitNotiDto extends PickType(Notification, [
  'userKakaoId',
  'targetUserKakaoId',
  'type',
]) {}

export class EmitNotiInput extends OmitType(EmitNotiDto, ['userKakaoId']) {}
