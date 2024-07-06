import { Injectable } from '@nestjs/common';
import { IArticlesServiceCreate } from '../interfaces/articles.service.interface';
import { DataSource } from 'typeorm';
import { Article } from '../entities/article.entity';
import { StickerBlocksService } from 'src/APIs/stickerBlocks/stickerBlocks.service';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';
import { ArticleCreateResponseDto } from '../dtos/response/article-create-response.dto';
import { getUUID } from 'src/utils/uuidUtils';
import { ImagesService } from 'src/modules/images/images.service';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';

@Injectable()
export class ArticlesCreateService {
  constructor(
    private readonly db_dataSource: DataSource,
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly svc_images: ImagesService,
    private readonly svc_stickerBlocks: StickerBlocksService,
    private readonly repo_articlesRead: ArticlesReadRepository,
  ) {}

  async save(
    createArticleDto: IArticlesServiceCreate,
  ): Promise<ArticleCreateResponseDto> {
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const article = {};
    try {
      Object.keys(createArticleDto).map((el) => {
        const value = createArticleDto[el];
        if (createArticleDto[el] != null) {
          article[el] = value;
        }
      });
      await this.svc_articlesValidate.fkValidCheck({
        articles: article,
        passNonEssentail: !createArticleDto.isPublished,
      });
      const queryResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Article, Object.keys(article))
        .values(article)
        .execute();
      await queryRunner.commitTransaction();
      const articleData = await this.repo_articlesRead.findOne({
        where: { id: queryResult.identifiers[0].id },
      });
      const stickerBlockData = await this.svc_stickerBlocks.createStickerBlocks(
        {
          articleId: articleData.id,
          stickerBlocks: createArticleDto.stickerBlocks,
        },
      );
      return { articleData, stickerBlockData };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async imageUpload(
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const { imageUrl } = await this.svc_images.imageUpload({
      file,
      ext: 'png',
      resize: 1280,
    });

    return { imageUrl };
  }
}
