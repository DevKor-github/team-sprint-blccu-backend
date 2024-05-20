import { Feedback } from '../entities/feedback.entity';

export interface IFeedbacksServiceCreate extends Pick<Feedback, 'content'> {
  kakaoId: number;
}

export interface IFeedbacksServiceKakaoId {
  kakaoId: number;
}
