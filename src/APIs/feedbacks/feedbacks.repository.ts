import { DataSource, Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedbacksRepository extends Repository<Feedback> {
  constructor(private datasource: DataSource) {
    super(Feedback, datasource.createEntityManager());
  }
}
