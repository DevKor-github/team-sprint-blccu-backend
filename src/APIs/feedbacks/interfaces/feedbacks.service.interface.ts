import { Feedback } from '../entities/feedback.entity';

export interface IFeedbacksServiceCreateFeedback
  extends Pick<Feedback, 'content' | 'type'> {
  userId: number;
}

export interface IFeedbacksServiceUserId {
  userId: number;
}
