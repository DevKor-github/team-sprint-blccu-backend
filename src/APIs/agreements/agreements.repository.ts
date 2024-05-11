import { DataSource, Repository } from 'typeorm';
import { Agreement } from './entities/agreement.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AgreementsRepository extends Repository<Agreement> {
  constructor(private dataSource: DataSource) {
    super(Agreement, dataSource.createEntityManager());
  }
}
