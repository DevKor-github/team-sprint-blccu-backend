export enum PostsOrderOption {
  LIKE = 'like_count',
  VIEW = 'view_count',
  COMMENT = 'comment_count',
  DATE = 'id',
}

// client에게 key값을 받기 위한 wrapping enum
export enum PostsOrderOptionWrap {
  LIKE = 'LIKE',
  VIEW = 'VIEW',
  COMMENT = 'COMMENT',
  DATE = 'DATE',
}
