import { CommentCreateRequestDto } from '../dtos/request/comment-create-request.dto';

export interface ICommentsServiceArticleIdValidCheck {
  parentId: number;
  articleId: number;
}

export interface ICommentsServiceId {
  commentId: number;
}

export interface ICommentsServicePatchComment {
  userId: number;
  articleId: number;
  commentId: number;
  content: string;
}

export interface ICommentsServiceFindComments {
  articleId: number;
}

export interface ICommentsServiceDeleteComment {
  commentId: number;
  userId: number;
  articleId: number;
}

export interface ICommentsServiceCreateComment extends CommentCreateRequestDto {
  articleId: number;
  userId: number;
}
