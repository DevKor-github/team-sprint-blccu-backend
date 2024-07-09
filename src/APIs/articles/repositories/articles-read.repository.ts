import { DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';
import { ArticleDetailResponseDto } from '../dtos/response/article-detail-response.dto';
import { ArticleDto } from '../dtos/common/article.dto';

@Injectable()
export class ArticlesReadRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
  async readDetail({ articleId, scope }): Promise<ArticleDetailResponseDto> {
    await this.update(articleId, {
      viewCount: () => 'view_count +1',
    });
    return await this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'article_background')
      .leftJoinAndSelect('p.articleCategory', 'article_category')
      .addSelect([
        'user.handle',
        'user.id',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.id = :articleId', { articleId })
      .andWhere('p.scope IN (:scope)', { scope })
      .andWhere('p.date_deleted IS NULL')
      .getOne();
  }

  async readUpdateDetail({ articleId }): Promise<ArticleDetailResponseDto> {
    return await this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'article_background')
      .leftJoinAndSelect('p.articleCategory', 'article_category')
      .addSelect([
        'user.handle',
        'user.id',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.id = :articleId', { articleId })
      .andWhere('p.date_deleted IS NULL')
      .getOne();
  }

  async readTemp({ userId }): Promise<ArticleDto[]> {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'article_background')
      .leftJoinAndSelect('p.articleCategory', 'article_category')
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
