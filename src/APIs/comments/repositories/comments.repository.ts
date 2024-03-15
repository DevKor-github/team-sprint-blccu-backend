import { Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentsRepository {
  private commentsRepository: Repository<Comment>;

  constructor(private readonly datasource: DataSource) {
    this.commentsRepository = this.datasource.getRepository(Comment);
  }
  async getCommentList(id: number) {
    return await this.commentsRepository
      .createQueryBuilder('comment')
      .withDeleted()
      .addSelect(['user.kakaoId', 'user.username', 'user.profile_image'])
      .addSelect(['post.id', 'post.title'])
      .addSelect([
        'childrenUser.kakaoId',
        'childrenUser.username',
        'childrenUser.profile_image',
      ])
      .addSelect([
        'childrenUser2.kakaoId',
        'childrenUser2.username',
        'childrenUser2.profile_image',
        ,
      ])
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.post', 'post')
      .leftJoinAndSelect('comment.children', 'children')
      .leftJoin('children.user', 'childrenUser')
      .leftJoinAndSelect('children.children', 'children2')
      .leftJoin('children2.user', 'childrenUser2')
      .where('comment.post = :id', { id })
      .andWhere('comment.parent_id IS NULL')
      .orderBy('comment.id', 'ASC')
      .addOrderBy('children.id', 'ASC')
      .setParameter('id', id)
      .getMany();
  }
}
