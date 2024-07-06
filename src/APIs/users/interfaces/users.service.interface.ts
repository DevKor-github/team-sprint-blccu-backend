import { FeedbackType } from 'src/common/enums/feedback-type.enum';
import { User } from '../entities/user.entity';

export interface IUsersServiceImageUpload {
  userId: number;
  file: Express.Multer.File;
}

export interface IUsersServiceCreate {
  userId: number;
}

export interface IUsersServiceFindUserByKakaoId {
  userId: number;
}

export interface IUsersServiceDelete {
  type: FeedbackType;
  content: string;
  userId: number;
}

export interface IUsersServiceFindUserByHandle extends Pick<User, 'handle'> {}

export interface IUsersServiceFindUser {
  id: string;
}

export interface IUsersServiceImageUpload {
  file: Express.Multer.File;
  resize: number;
}
