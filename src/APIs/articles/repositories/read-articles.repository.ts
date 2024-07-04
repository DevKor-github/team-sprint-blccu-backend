import { DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReadArticlesRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
  async fetchArticlesDetail({ id, scope }): Promise<PostResponseDto> {
    await this.update(id, {
      viewCount: () => 'view_count +1',
    });
    return await this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.article_background', 'article_background')
      .leftJoinAndSelect('p.article_category', 'article_category')
      .addSelect([
        'user.handle',
        'user.id',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.id = :id', { id })
      .andWhere('p.scope IN (:scope)', { scope })
      .andWhere('p.date_deleted IS NULL')
      .getOne();
  }
}
