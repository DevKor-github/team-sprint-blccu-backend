export enum ArticleFilterOption {
  TITLE = 'p.title',
  CONTENT = 'p.content',
  USER = 'user.username',
}
// client에게 key값을 받기 위한 wrapping enum
export enum ArticleFilterOptionWrap {
  TITLE = 'TITLE',
  CONTENT = 'CONTENT',
  USER = 'USER',
}
