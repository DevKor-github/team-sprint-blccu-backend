import { DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';
import { ArticleDetailResponseDto } from '../dtos/response/article-detail-response.dto';
import { transformKeysToArgsFormat } from 'src/utils/class.utils';
import { USER_PRIMARY_RESPONSE_DTO_KEYS } from 'src/APIs/users/dtos/response/user-primary-response.dto';

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
      .addSelect(
        transformKeysToArgsFormat({
          args: 'user',
          keys: USER_PRIMARY_RESPONSE_DTO_KEYS,
        }),
      )
      .where('p.id = :articleId', { articleId })
      .andWhere('p.scope IN (:scope)', { scope })
      .andWhere('p.dateDeleted IS NULL')
      .getOne();
  }

  async readUpdateDetail({ articleId }): Promise<ArticleDetailResponseDto> {
    return await this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'article_background')
      .leftJoinAndSelect('p.articleCategory', 'article_category')
      .addSelect(
        transformKeysToArgsFormat({
          args: 'user',
          keys: USER_PRIMARY_RESPONSE_DTO_KEYS,
        }),
      )
      .where('p.id = :articleId', { articleId })
      .andWhere('p.dateDeleted IS NULL')
      .getOne();
  }

  async readTemp({ userId }): Promise<ArticleDetailResponseDto[]> {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'article_background')
      .leftJoinAndSelect('p.articleCategory', 'article_category')
      .addSelect(
        transformKeysToArgsFormat({
          args: 'user',
          keys: USER_PRIMARY_RESPONSE_DTO_KEYS,
        }),
      )
      .where('p.userId = :userId', { userId })
      .andWhere(`p.isPublished = false`)
      .andWhere('p.dateDeleted IS NULL')
      .orderBy('p.id', 'DESC')
      .getMany();
  }
}
