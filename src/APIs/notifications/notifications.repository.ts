import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { DataSource, Repository } from 'typeorm';

import {
  INotificationsServiceRead,
  INotificationsSeviceEmitNotification,
} from './interfaces/notifications.service.interface';
import { NotificationsGetResponseDto } from './dtos/response/notifications-get-response.dto';

@Injectable()
export class NotificationsRepository extends Repository<Notification> {
  constructor(private db_dataSource: DataSource) {
    super(Notification, db_dataSource.createEntityManager());
  }

  async createOne(emitNotiDto: INotificationsSeviceEmitNotification) {
    return await this.createQueryBuilder()
      .insert()
      .into(Notification, Object.keys(emitNotiDto))
      .values(emitNotiDto)
      .execute();
  }

  async fetchOne({
    notificationId,
    targetUserId,
  }: INotificationsServiceRead): Promise<NotificationsGetResponseDto> {
    return await this.createQueryBuilder('n')
      .leftJoin('n.user', 'user')
      .addSelect(['user.profileImage', 'user.username', 'user.handle'])
      .where('n.id = :id', { id: notificationId })
      .andWhere('n.targetUserId = :targetUserId', {
        targetUserId,
      })
      .getOne();
  }

  async fetchAll({
    userId,
    dateCreated,
    isChecked,
  }): Promise<NotificationsGetResponseDto[]> {
    const query = this.createQueryBuilder('n')
      .leftJoin('n.user', 'user')
      .addSelect(['user.profileImage', 'user.username', 'user.handle'])
      .where('n.targetUserId = :userId', {
        userId,
      });
    if (!isChecked) {
      query.andWhere('n.isChecked = true');
    }
    if (dateCreated) {
      query.andWhere('n.dateCreated > :date_created', { dateCreated });
    }

    return await query.getMany();
  }
}
