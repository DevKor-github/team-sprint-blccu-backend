import { DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateArticlesRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
}
