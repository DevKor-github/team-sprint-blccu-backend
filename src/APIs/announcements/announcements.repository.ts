import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsRepository extends Repository<Announcement> {
  constructor(private db_dataSource: DataSource) {
    super(Announcement, db_dataSource.createEntityManager());
  }
}
