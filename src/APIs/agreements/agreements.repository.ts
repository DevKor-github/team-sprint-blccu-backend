import { DataSource, Repository } from 'typeorm';
import { Agreement } from './entities/agreement.entity';

export class AgreementsRepository extends Repository<Agreement> {
  constructor(private dataSource: DataSource) {
    super(Agreement, dataSource.createEntityManager());
  }
}
