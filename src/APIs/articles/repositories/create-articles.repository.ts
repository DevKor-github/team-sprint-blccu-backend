import { DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateArticlesRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
  async insert(article) {
    return await this.createQueryBuilder()
      .insert()
      .into(Article, Object.keys(article))
      .values(article)
      .execute();
  }
}
