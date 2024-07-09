import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';
import { StickerBlocksService } from 'src/APIs/stickerBlocks/stickerBlocks.service';
import { FollowsService } from 'src/APIs/follows/follows.service';
import {
  IArticlesServiceArticleId,
  IArticlesServiceArticleUserIdPair,
} from '../interfaces/articles.service.interface';
import { ArticleDetailForUpdateResponseDto } from '../dtos/response/article-detail-for-update-response.dto';
import { ArticleDetailResponseDto } from '../dtos/response/article-detail-response.dto';
import { ArticleDto } from '../dtos/common/article.dto';

@Injectable()
export class ArticlesReadService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly svc_stickerBlocks: StickerBlocksService,
    private readonly svc_follows: FollowsService,
    private readonly repo_articlesRead: ArticlesReadRepository,
  ) {}

  async findArticlesById({ articleId }: IArticlesServiceArticleId) {
    return await this.repo_articlesRead.findOne({ where: { id: articleId } });
  }

  async readArticleUpdateDetail({
    articleId,
    userId,
  }: IArticlesServiceArticleUserIdPair): Promise<ArticleDetailForUpdateResponseDto> {
    const data = await this.svc_articlesValidate.existCheck({ articleId });
    await this.svc_articlesValidate.fkValidCheck({
      articles: data,
      passNonEssentail: true,
    });
    if (data.userId !== userId)
      throw new UnauthorizedException('본인이 아닙니다.');
    const article = await this.repo_articlesRead.readUpdateDetail({
      articleId,
    });
    const stickerBlocks = await this.svc_stickerBlocks.findStickerBlocks({
      articleId,
    });
    return { article, stickerBlocks };
  }

  async readTempArticles({ userId }): Promise<ArticleDto[]> {
    return await this.repo_articlesRead.readTemp({ userId });
  }

  async readArticleDetail({
    userId,
    articleId,
  }: IArticlesServiceArticleUserIdPair): Promise<ArticleDetailResponseDto> {
    const data = await this.svc_articlesValidate.existCheck({ articleId });
    await this.svc_articlesValidate.fkValidCheck({
      articles: data,
      passNonEssentail: false,
    });
    const scope = await this.svc_follows.getScope({
      fromUser: data.userId,
      toUser: userId,
    });
    // const comments = await this.commentsService.fetchComments({ articlesId: id });
    const article = await this.repo_articlesRead.readDetail({
      articleId,
      scope,
    });
    console.log(data, article);
    return article;
  }
}
