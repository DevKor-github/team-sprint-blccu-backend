import { Injectable } from '@nestjs/common';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesCreateRepository } from '../repositories/articles-create.repository';
import { IArticlesServicePatchArticle } from '../interfaces/articles.service.interface';
import { ArticleDto } from '../dtos/common/article.dto';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';

@Injectable()
export class ArticlesUpdateService {
  constructor(
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly repo_articlesCreate: ArticlesCreateRepository,
  ) {}

  @ExceptionMetadata([EXCEPTIONS.NOT_THE_OWNER])
  @MergeExceptionMetadata([
    { service: ArticlesValidateService, methodName: 'existCheck' },
    { service: ArticlesValidateService, methodName: 'fkValidCheck' },
  ])
  async patchArticle({
    userId,
    articleId,
    ...rest
  }: IArticlesServicePatchArticle): Promise<ArticleDto> {
    const articleData = await this.svc_articlesValidate.existCheck({
      articleId,
    });
    if (articleData.userId != userId) throw new BlccuException('NOT_THE_OWNER');
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
