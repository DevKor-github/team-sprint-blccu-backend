export interface ICommentsServicePostsIdValidCheck {
  parentId: number;
  postsId: number;
}

export interface ICommentsServiceId {
  id: number;
}

export interface ICommentsServicePatch {
  kakaoId: number;
  postsId: number;
  id: number;
  content: string;
}

export interface ICommentsServiceFetch {
  postsId: number;
}

export interface ICommentsServiceDelete {
  id: number;
  userKakaoId: number;
  postsId: number;
}
