export interface IUsersServiceCreate {
  kakaoId: number;
  profile_image: string;
  username: string;
}

export interface IUsersServiceFindUserByKakaoId {
  kakaoId: number;
}

export interface IUsersServiceFindUser {
  id: string;
}
