import { DataSource, InsertResult, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Injectable } from '@nestjs/common';
import {
  ICommentsRepositoryId,
  ICommentsRepositoryInsertComment,
  ICommentsRepositoryfetchComments,
} from './interfaces/comments.repository.interface';
import { CommentsGetResponseDto } from './dtos/response/comments-get-response.dto';

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
      .leftJoinAndSelect('c.user', 'user')
      .leftJoinAndSelect('c.article', 'article')
      .leftJoinAndSelect('c.parent', 'parent')
      .where('c.id = :commentId', { commentId })
      .getOne();
  }

  async fetchComments({
    articleId,
  }: ICommentsRepositoryfetchComments): Promise<CommentsGetResponseDto[]> {
    let comments = await this.createQueryBuilder('c')
      .withDeleted()
      .innerJoin('c.user', 'u')
      .addSelect([
        'u.id',
        'u.username',
        'u.description',
        'u.profile_image',
        'u.handle',
      ])
      .addSelect([
        'childrenUser.id',
        'childrenUser.username',
        'childrenUser.description',
        'childrenUser.profile_image',
        'childrenUser.handle',
      ])
      .leftJoinAndSelect('c.children', 'children')
      .leftJoin('children.user', 'childrenUser')
      .where('c.article_id = :articleId', { articleId })
      .andWhere('c.parent_id IS NULL')
      .orderBy('c.date_created', 'ASC')
      .addOrderBy('children.date_created', 'ASC')
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
