import { Injectable } from '@nestjs/common';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesDeleteRepository } from '../repositories/articles-delete.repository';
import { StickerBlocksService } from 'src/APIs/stickerBlocks/stickerBlocks.service';
import { AwsService } from 'src/modules/aws/aws.service';
import { IArticlesServiceArticleUserIdPair } from '../interfaces/articles.service.interface';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';

@Injectable()
export class ArticlesDeleteService {
  constructor(
    // private readonly dataSource: DataSource,
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly svc_stickerBlocks: StickerBlocksService,
    private readonly svc_aws: AwsService,
    private readonly repo_articlesRead: ArticlesReadRepository,
    private readonly repo_articlesDelete: ArticlesDeleteRepository,
  ) {}

  async softDelete({ userId, articleId }: IArticlesServiceArticleUserIdPair) {
    const data = await this.repo_articlesRead.findOne({
      where: { user: { id: userId }, id: articleId },
    });
    if (data) {
      await this.svc_aws.deleteImageFromS3({ url: data.imageUrl });
      await this.svc_aws.deleteImageFromS3({ url: data.mainImageUrl });
      await this.svc_stickerBlocks.deleteBlocks({ userId, articleId });
    }
    return await this.repo_articlesDelete.softDelete({
      user: { id: userId },
      id: articleId,
    });
  }

  async hardDelete({ userId, articleId }: IArticlesServiceArticleUserIdPair) {
    const data = await this.repo_articlesRead.findOne({
      where: { user: { userId }, articleId },
    });
    if (data) {
      await this.svc_aws.deleteImageFromS3({ url: data.imageUrl });
      await this.svc_aws.deleteImageFromS3({ url: data.mainImageUrl });
      await this.svc_stickerBlocks.deleteBlocks({ userId, articleId });
    }
    return await this.repo_articlesDelete.delete({
      user: { id: userId },
      id: articleId,
    });
  }
}
