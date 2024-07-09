export enum ArticleOrderOption {
  LIKE = 'likeCount',
  VIEW = 'viewCount',
  COMMENT = 'commentCount',
  DATE = 'id',
}

// client에게 key값을 받기 위한 wrapping enum
export enum ArticleOrderOptionWrap {
  LIKE = 'LIKE',
  VIEW = 'VIEW',
  COMMENT = 'COMMENT',
  DATE = 'DATE',
}
