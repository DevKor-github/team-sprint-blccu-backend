import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IArticlesServiceArticleId } from '../interfaces/articles.service.interface';
import { DataSource } from 'typeorm';
import { ArticleCategory } from 'src/APIs/articleCategories/entities/articleCategory.entity';
import { ArticleBackground } from 'src/APIs/articleBackgrounds/entities/articleBackground.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';

@Injectable()
export class ArticlesValidateService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repo_articlesRead: ArticlesReadRepository,
  ) {}

  async existCheck({ articleId }: IArticlesServiceArticleId) {
    const data = await this.repo_articlesRead.findOne({
      where: { id: articleId },
    });
    if (!data) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    return data;
  }

  async fkValidCheck({ articles, passNonEssentail }) {
    const pc = await this.dataSource
      .getRepository(ArticleCategory)
      .createQueryBuilder('pc')
      .where('pc.id = :id', { id: articles.articleCategoryId })
      .getOne();
    if (pc == null && !passNonEssentail)
      throw new BadRequestException('존재하지 않는 article_category입니다.');
    const pg = await this.dataSource
      .getRepository(ArticleBackground)
      .createQueryBuilder('pg')
      .where('pg.id = :id', { id: articles.articleBackgroundId })
      .getOne();
    if (pg == null && !passNonEssentail)
      throw new BadRequestException('존재하지 않는 article_background입니다.');
    const us = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('us')
      .where('us.id = :id', { id: articles.userId })
      .getOne();
    if (us == null) throw new BadRequestException('존재하지 않는 user입니다.');
  }
}
