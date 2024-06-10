import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { DataSource, Repository } from 'typeorm';
import { EmitNotiDto } from './dtos/emit-noti.dto';
import { FetchNotiResponse } from './dtos/fetch-noti.dto';
import { INotificationsServiceRead } from './interfaces/notifications.service.interface';

@Injectable()
export class NotificationsRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  async createOne(emitNotiDto: EmitNotiDto) {
    return await this.createQueryBuilder()
      .insert()
      .into(Notification, Object.keys(emitNotiDto))
      .values(emitNotiDto)
      .execute();
  }

  async fetchOne({
    id,
    targetUserKakaoId,
  }: INotificationsServiceRead): Promise<FetchNotiResponse> {
    return await this.createQueryBuilder('n')
      .leftJoin('n.user', 'user')
      .addSelect(['user.profile_image', 'user.username', 'user.handle'])
      .where('n.id = :id', { id })
      .andWhere('n.targetUserKakaoId = :targetUserKakaoId', {
        targetUserKakaoId,
      })
      .getOne();
  }

  async fetchAll({
    kakaoId,
    date_created,
    is_checked,
  }): Promise<FetchNotiResponse[]> {
    const query = this.createQueryBuilder('n')
      .leftJoin('n.user', 'user')
      .addSelect(['user.profile_image', 'user.username', 'user.handle'])
      .where('n.targetUserKakaoId = :kakaoId', {
        kakaoId,
      });
    if (!is_checked) {
      query.andWhere('n.is_checked = true');
    }
    if (date_created) {
      query.andWhere('n.date_created > :date_created', { date_created });
    }
    // 열 이름을 별칭으로 지정하여 원래 이름 그대로 출력
    // const columnNames = (await this.metadata.columns).map(
    //   (column) => `n.${column.databaseName} AS ${column.propertyName}`,
    // );
    // query.addSelect(columnNames);
    return await query.getMany();
  }
}
