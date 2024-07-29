import { Injectable } from '@nestjs/common';
import { IArticlesServiceArticleId } from '../interfaces/articles.service.interface';
import { DataSource } from 'typeorm';
import { ArticleCategory } from 'src/APIs/articleCategories/entities/articleCategory.entity';
import { ArticleBackground } from 'src/APIs/articleBackgrounds/entities/articleBackground.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';

@Injectable()
export class ArticlesValidateService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repo_articlesRead: ArticlesReadRepository,
  ) {}

  @ExceptionMetadata([EXCEPTIONS.ARTICLE_NOT_FOUND])
  async existCheck({ articleId }: IArticlesServiceArticleId) {
    const data = await this.repo_articlesRead.findOne({
      where: { id: articleId },
    });
    if (!data) throw new BlccuException('ARTICLE_NOT_FOUND');
    return data;
  }

  @ExceptionMetadata([
    EXCEPTIONS.USER_NOT_FOUND,
    EXCEPTIONS.ARTICLE_BACKGROUND_NOT_FOUND,
    EXCEPTIONS.ARTICLE_CATEGORY_NOT_FOUND,
  ])
  async fkValidCheck({ articles, passNonEssentail }) {
    const pc = await this.dataSource
      .getRepository(ArticleCategory)
      .createQueryBuilder('pc')
      .where('pc.id = :id', { id: articles.articleCategoryId })
      .getOne();
    if (pc == null && !passNonEssentail)
      throw new BlccuException('ARTICLE_CATEGORY_NOT_FOUND');
    if (articles.articleBackgroundId != null) {
      const pg = await this.dataSource
        .getRepository(ArticleBackground)
        .createQueryBuilder('pg')
        .where('pg.id = :id', { id: articles.articleBackgroundId })
        .getOne();
      if (pg == null && !passNonEssentail)
        throw new BlccuException('ARTICLE_BACKGROUND_NOT_FOUND');
    }
    const us = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('us')
      .where('us.id = :id', { id: articles.userId })
      .getOne();
    if (us == null) throw new BlccuException('USER_NOT_FOUND');
  }
}
