import { Controller } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';

@Controller()
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}
}
