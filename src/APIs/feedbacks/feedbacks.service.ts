import { Injectable } from '@nestjs/common';
import { FeedbacksRepository } from './feedbacks.repository';

@Injectable()
export class FeedbacksService {
  constructor(private readonly feedbacksRepository: FeedbacksRepository) {}
}
