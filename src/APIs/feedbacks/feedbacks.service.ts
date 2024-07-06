import { Injectable } from '@nestjs/common';
import { FeedbacksRepository } from './feedbacks.repository';
import {
  IFeedbacksServiceCreateFeedback,
  IFeedbacksServiceUserId,
} from './interfaces/feedbacks.service.interface';
import { FeedbackDto } from './dtos/common/feedback.dto';
import { UsersValidateService } from '../users/services/users-validate-service';

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly repo_feedbacks: FeedbacksRepository,
    private readonly svc_usersValidate: UsersValidateService,
  ) {}

  async createFeedback({
    userId,
    content,
    type,
  }: IFeedbacksServiceCreateFeedback): Promise<FeedbackDto> {
    return await this.repo_feedbacks.save({
      type,
      content,
      userId: userId,
    });
  }

  async fetchFeedbacks({
    userId,
  }: IFeedbacksServiceUserId): Promise<FeedbackDto[]> {
    await this.svc_usersValidate.adminCheck({ userId });
    return await this.repo_feedbacks.find();
  }
}
