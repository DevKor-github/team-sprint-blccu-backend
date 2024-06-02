import { Injectable } from '@nestjs/common';
import { FeedbacksRepository } from './feedbacks.repository';
import {
  IFeedbacksServiceCreate,
  IFeedbacksServiceKakaoId,
} from './interfaces/feedbacks.service.interface';
import { FetchFeedbackDto } from './dtos/fetch-feedback.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly feedbacksRepository: FeedbacksRepository,
    private readonly usersService: UsersService,
  ) {}

  async create({
    kakaoId,
    content,
    type,
  }: IFeedbacksServiceCreate): Promise<FetchFeedbackDto> {
    return await this.feedbacksRepository.save({
      type,
      content,
      userKakaoId: kakaoId,
    });
  }

  async fetchAll({
    kakaoId,
  }: IFeedbacksServiceKakaoId): Promise<FetchFeedbackDto[]> {
    await this.usersService.adminCheck({ kakaoId });
    return await this.feedbacksRepository.find();
  }
}
