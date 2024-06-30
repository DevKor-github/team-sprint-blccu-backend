export enum PostsFilterOption {
  TITLE = 'p.title',
  CONTENT = 'p.content',
  USER = 'user.username',
}
// client에게 key값을 받기 위한 wrapping enum
export enum PostsFilterOptionWrap {
  TITLE = 'TITLE',
  CONTENT = 'CONTENT',
  USER = 'USER',
}
