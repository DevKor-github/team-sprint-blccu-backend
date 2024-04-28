import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { DataSource, Repository } from 'typeorm';
import { EmitNotiDto } from './dtos/emit-noti.dto';
import { FetchNotiResponse } from './dtos/fetch-noti.dto';

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

  async fetchAll({
    kakaoId,
    date_created,
    is_checked,
  }): Promise<FetchNotiResponse[]> {
    const query = this.createQueryBuilder('').where('userKakaoId = :kakaoId', {
      kakaoId,
    });
    if (!is_checked) {
      query.andWhere('is_checked = true');
    }
    if (date_created) {
      query.andWhere('date_created > :date_created', { date_created });
    }
    // 열 이름을 별칭으로 지정하여 원래 이름 그대로 출력
    const columnNames = (await this.metadata.columns).map(
      (column) => `${column.databaseName} AS ${column.propertyName}`,
    );
    query.select(columnNames);
    return await query.execute();
  }
}
