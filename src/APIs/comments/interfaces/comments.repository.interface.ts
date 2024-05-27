import { CreateCommentDto } from '../dtos/create-comment.dto';

export interface ICommentsRepositoryInsertComment {
  createCommentDto: CreateCommentDto;
}

export interface ICommentsRepositoryfetchComments {
  postsId: number;
}

export interface ICommentsRepositoryId {
  id: number;
}
