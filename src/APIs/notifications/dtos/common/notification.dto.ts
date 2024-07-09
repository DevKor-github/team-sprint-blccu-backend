import { OmitType } from '@nestjs/swagger';
import { Notification } from '../../entities/notification.entity';

export class NotificationDto extends OmitType(Notification, [
  'article',
  'targetUser',
  'user',
] as const) {}
