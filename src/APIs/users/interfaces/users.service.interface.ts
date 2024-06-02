import { FeedbackType } from 'src/common/enums/feedback-type.enum';
import { User } from '../entities/user.entity';

export interface IUsersServiceCreate {
  kakaoId: number;
}

export interface IUsersServiceFindUserByKakaoId {
  kakaoId: number;
}

export interface IUsersServiceDelete {
  type: FeedbackType;
  content: string;
  kakaoId: number;
}

export interface IUsersServiceFindUserByHandle extends Pick<User, 'handle'> {}

export interface IUsersServiceFindUser {
  id: string;
}
