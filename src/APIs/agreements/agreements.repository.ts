import { DataSource, Repository } from 'typeorm';
import { Agreement } from './entities/agreement.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AgreementsRepository extends Repository<Agreement> {
  constructor(private db_dataSource: DataSource) {
    super(Agreement, db_dataSource.createEntityManager());
  }
  getHello(): string {
    return '1';
  }
}
