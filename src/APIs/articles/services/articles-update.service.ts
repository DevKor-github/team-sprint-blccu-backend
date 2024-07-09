import { ForbiddenException, Injectable } from '@nestjs/common';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesCreateRepository } from '../repositories/articles-create.repository';
import { IArticlesServicePatchArticle } from '../interfaces/articles.service.interface';
import { ArticleDto } from '../dtos/common/article.dto';

@Injectable()
export class ArticlesUpdateService {
  constructor(
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly repo_articlesCreate: ArticlesCreateRepository,
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
