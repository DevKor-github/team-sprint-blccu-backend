import { Injectable } from '@nestjs/common';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesDeleteRepository } from '../repositories/articles-delete.repository';
import { StickerBlocksService } from 'src/APIs/stickerBlocks/stickerBlocks.service';
import { IArticlesServiceArticleUserIdPair } from '../interfaces/articles.service.interface';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';
import { ImagesService } from 'src/modules/images/images.service';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';
import { isURL } from 'class-validator';

@Injectable()
export class ArticlesDeleteService {
  constructor(
    // private readonly dataSource: DataSource,
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly svc_stickerBlocks: StickerBlocksService,
    private readonly svc_images: ImagesService,
    private readonly repo_articlesRead: ArticlesReadRepository,
    private readonly repo_articlesDelete: ArticlesDeleteRepository,
  ) {}

  @MergeExceptionMetadata([
    { service: ImagesService, methodName: 'deleteImage' },
    { service: StickerBlocksService, methodName: 'deleteStickerBlocks' },
  ])
  async softDelete({ userId, articleId }: IArticlesServiceArticleUserIdPair) {
    const data = await this.repo_articlesRead.findOne({
      where: { user: { id: userId }, id: articleId },
    });
    if (data) {
      await this.svc_images.deleteImage({ url: data.imageUrl });
      await this.svc_images.deleteImage({ url: data.mainImageUrl });
      await this.svc_stickerBlocks.deleteStickerBlocks({ userId, articleId });
    }
    return await this.repo_articlesDelete.softDelete({
      user: { id: userId },
      id: articleId,
    });
  }

  @MergeExceptionMetadata([
    { service: ImagesService, methodName: 'deleteImage' },
    { service: StickerBlocksService, methodName: 'deleteStickerBlocks' },
  ])
  async hardDelete({ userId, articleId }: IArticlesServiceArticleUserIdPair) {
    const data = await this.repo_articlesRead.findOne({
      where: { userId, id: articleId },
    });
    if (isURL(data.imageUrl)) {
      await this.svc_images.deleteImage({ url: data.imageUrl });
    }
    if (isURL(data.mainImageUrl)) {
      await this.svc_images.deleteImage({ url: data.mainImageUrl });
    }
    await this.svc_stickerBlocks.deleteStickerBlocks({ userId, articleId });

    return await this.repo_articlesDelete.delete({
      user: { id: userId },
      id: articleId,
    });
  }
}
