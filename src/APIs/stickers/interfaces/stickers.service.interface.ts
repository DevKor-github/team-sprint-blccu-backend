export interface IStickersServiceId {
  id: number;
}

export interface IStickersServiceDelete {
  id: number;
  kakaoId: number;
}

export interface IStickersServiceFetchUserStickers {
  userKakaoId: number;
}
