import { NotificationEmitRequestDto } from '../dtos/request/notification-emit-request.dto';
import { NotificationsGetRequestDto } from '../dtos/request/notifications-get-request.dto';

export interface INotificationsServiceConnectUser {
  targetUserId: number;
}

export interface INotificationsServiceRead {
  notificationId: number;
  targetUserId: number;
}
export interface INotificationsSeviceEmitNotification
  extends NotificationEmitRequestDto {
  userId: number;
}

export class INotificationsServiceGetNotifications extends NotificationsGetRequestDto {
  userId: number;
}
