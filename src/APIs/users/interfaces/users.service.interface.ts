import { User } from '../entities/user.entity';

export interface IUsersServiceCreate {
  kakaoId: number;
}

export interface IUsersServiceFindUserByKakaoId {
  kakaoId: number;
}

export interface IUsersServiceFindUserByHandle extends Pick<User, 'handle'> {}

export interface IUsersServiceFindUser {
  id: string;
}
