import { ICommentsServiceCreateComment } from './comments.service.interface';

export interface ICommentsRepositoryInsertComment {
  createCommentDto: ICommentsServiceCreateComment;
}

export interface ICommentsRepositoryfetchComments {
  articleId: number;
}

export interface ICommentsRepositoryId {
  commentId: number;
}
