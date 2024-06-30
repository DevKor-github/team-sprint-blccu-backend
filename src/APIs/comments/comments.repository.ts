import { DataSource, InsertResult, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { FetchCommentsDto } from './dtos/fetch-comments.dto';
import {
  ICommentsRepositoryId,
  ICommentsRepositoryInsertComment,
  ICommentsRepositoryfetchComments,
} from './interfaces/comments.repository.interface';

@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
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
    id,
  }: ICommentsRepositoryId): Promise<Comment> {
    return await this.createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user')
      .leftJoinAndSelect('c.posts', 'posts')
      .leftJoinAndSelect('c.parent', 'parent')
      .where('c.id = :id', { id })
      .getOne();
  }

  async fetchComments({
    postsId,
  }: ICommentsRepositoryfetchComments): Promise<FetchCommentsDto[]> {
    let comments = await this.createQueryBuilder('c')
      .withDeleted()
      .innerJoin('c.user', 'u')
      .addSelect([
        'u.kakaoId',
        'u.username',
        'u.description',
        'u.profile_image',
        'u.handle',
      ])
      .addSelect([
        'childrenUser.kakaoId',
        'childrenUser.username',
        'childrenUser.description',
        'childrenUser.profile_image',
        'childrenUser.handle',
      ])
      .leftJoinAndSelect('c.children', 'children')
      .leftJoin('children.user', 'childrenUser')
      .where('c.postsId = :postsId', { postsId })
      .andWhere('c.parentId IS NULL')
      .orderBy('c.date_created', 'ASC')
      .addOrderBy('children.date_created', 'ASC')
      .getMany();

    comments = comments.filter((comment) => {
      comment.children = comment.children.filter(
        (child) => child.date_deleted === null,
      );
      // comment.children.length가 0이고 comment.date_deleted가 null이 아닌 경우를 제외
      return !(comment.children.length === 0 && comment.date_deleted !== null);
    });

    return comments;
  }
}
