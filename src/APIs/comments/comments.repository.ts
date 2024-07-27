import { DataSource, InsertResult, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Injectable } from '@nestjs/common';
import {
  ICommentsRepositoryId,
  ICommentsRepositoryInsertComment,
  ICommentsRepositoryfetchComments,
} from './interfaces/comments.repository.interface';
import { CommentsGetResponseDto } from './dtos/response/comments-get-response.dto';
import { USER_PRIMARY_RESPONSE_DTO_KEYS } from '../users/dtos/response/user-primary-response.dto';
import { transformKeysToArgsFormat } from 'src/utils/class.utils';

@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(private db_dataSource: DataSource) {
    super(Comment, db_dataSource.createEntityManager());
  }
  async insertComment({
    createCommentDto,
  }: ICommentsRepositoryInsertComment): Promise<InsertResult> {
    return await this.createQueryBuilder('c')
      .insert()
      .into(Comment, Object.keys(createCommentDto))
      .values(createCommentDto)
      .execute();
  }

  async fetchCommentWithNotiInfo({
    commentId,
  }: ICommentsRepositoryId): Promise<Comment> {
    return await this.createQueryBuilder('c')
      .leftJoin('c.user', 'user')
      .addSelect(
        transformKeysToArgsFormat({
          args: 'user',
          keys: USER_PRIMARY_RESPONSE_DTO_KEYS,
        }),
      )
      .leftJoinAndSelect('c.article', 'article')
      .leftJoinAndSelect('c.parent', 'parent')
      .where('c.id = :commentId', { commentId })
      .getOne();
  }

  async fetchAll({
    articleId,
  }: ICommentsRepositoryfetchComments): Promise<CommentsGetResponseDto[]> {
    let comments = await this.createQueryBuilder('c')
      .withDeleted()
      .innerJoin('c.user', 'u')
      .addSelect(
        transformKeysToArgsFormat({
          args: 'u',
          keys: USER_PRIMARY_RESPONSE_DTO_KEYS,
        }),
      )
      .addSelect(
        transformKeysToArgsFormat({
          args: 'childrenUser',
          keys: USER_PRIMARY_RESPONSE_DTO_KEYS,
        }),
      )
      .leftJoinAndSelect('c.children', 'children')
      .leftJoin('children.user', 'childrenUser')
      .where('c.articleId = :articleId', { articleId })
      .andWhere('c.parentId IS NULL')
      .orderBy('c.dateCreated', 'ASC')
      .addOrderBy('children.dateCreated', 'ASC')
      .getMany();

    comments = comments.filter((comment) => {
      comment.children = comment.children.filter(
        (child) => child.dateDeleted === null,
      );
      // comment.children.length가 0이고 comment.date_deleted가 null이 아닌 경우를 제외
      return !(comment.children.length === 0 && comment.dateDeleted !== null);
    });

    return comments;
  }
}
