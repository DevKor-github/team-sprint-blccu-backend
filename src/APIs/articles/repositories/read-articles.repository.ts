import { DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';
import { ArticleDetailResponse } from '../dtos/article-response.dto';

@Injectable()
export class ReadArticlesRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
  async readDetail({ id, scope }): Promise<ArticleDetailResponse> {
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

  async readUpdateDetail(id) {
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
      .andWhere('p.date_deleted IS NULL')
      .getOne();
  }

  async fetchTempArticles(userId: number): Promise<ArticleDetailResponse[]> {
    return this.createQueryBuilder('p')
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
      .where('p.user_id = :userId', { userId })
      .andWhere(`p.is_published = false`)
      .andWhere('p.date_deleted IS NULL')
      .orderBy('p.id', 'DESC')
      .getMany();
  }
}
