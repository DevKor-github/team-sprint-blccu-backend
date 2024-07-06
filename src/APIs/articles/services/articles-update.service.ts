import { ForbiddenException } from '@nestjs/common';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';
import { DataSource } from 'typeorm';
import { ArticlesUpdateRepository } from '../repositories/articles-update.repository';
import { ArticlesCreateRepository } from '../repositories/articles-create.repository';
import { IArticlesServicePatchArticle } from '../interfaces/articles.service.interface';
import { ArticleDto } from '../dtos/common/article.dto';

export class ArticlesUpdateService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly repo_articlesRead: ArticlesReadRepository,
    private readonly repo_articlesCreate: ArticlesCreateRepository,
    private readonly repo_articlesUpdate: ArticlesUpdateRepository,
  ) {}
  async patchArticle({
    userId,
    articleId,
    ...rest
  }: IArticlesServicePatchArticle): Promise<ArticleDto> {
    const articleData = await this.svc_articlesValidate.existCheck({
      articleId,
    });
    if (articleData.userId != userId)
      throw new ForbiddenException('게시글 작성자가 아닙니다.');
    Object.keys(rest).forEach((value) => {
      if (rest[value] != null) articleData[value] = rest[value];
    });
    await this.svc_articlesValidate.fkValidCheck({
      articles: articleData,
      passNonEssentail: false,
    });
    return await this.repo_articlesCreate.save(articleData); // 바꾸자로직
  }
}
