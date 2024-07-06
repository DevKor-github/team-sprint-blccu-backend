import { PickType } from '@nestjs/swagger';
import { NotificationDto } from '../common/notification.dto';

export class NotificationEmitRequestDto extends PickType(NotificationDto, [
  'targetUserId',
  'type',
  'articleId',
]) {}
