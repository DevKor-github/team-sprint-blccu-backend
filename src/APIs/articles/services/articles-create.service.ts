import { Injectable } from '@nestjs/common';
import {
  IArticlesServiceCreate,
  IArticlesServiceCreateDraft,
} from '../interfaces/articles.service.interface';
import { DataSource } from 'typeorm';
import { Article } from '../entities/article.entity';
import { StickerBlocksService } from 'src/APIs/stickerBlocks/stickerBlocks.service';
import { ArticlesValidateService } from './articles-validate.service';
import { ArticlesReadRepository } from '../repositories/articles-read.repository';
import { ArticleCreateResponseDto } from '../dtos/response/article-create-response.dto';
import { ImagesService } from 'src/modules/images/images.service';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';
import { ArticleDto } from '../dtos/common/article.dto';

@Injectable()
export class ArticlesCreateService {
  constructor(
    private readonly db_dataSource: DataSource,
    private readonly svc_articlesValidate: ArticlesValidateService,
    private readonly svc_images: ImagesService,
    private readonly svc_stickerBlocks: StickerBlocksService,
    private readonly repo_articlesRead: ArticlesReadRepository,
  ) {}

  @MergeExceptionMetadata([
    { service: ArticlesValidateService, methodName: 'fkValidCheck' },
    { service: StickerBlocksService, methodName: 'createStickerBlocks' },
  ])
  async save(
    createArticleDto: IArticlesServiceCreate,
  ): Promise<ArticleCreateResponseDto> {
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const article: Partial<ArticleDto> = {};
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
      const articleData = await queryRunner.manager.findOne(Article, {
        where: { id: queryResult.identifiers[0].id },
      });
      const stickerBlockData = await this.svc_stickerBlocks.createStickerBlocks(
        {
          articleId: articleData.id,
          stickerBlocks: createArticleDto.stickerBlocks,
        },
      );
      await queryRunner.commitTransaction();

      return { articleData, stickerBlockData };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  @MergeExceptionMetadata([
    { service: ArticlesValidateService, methodName: 'fkValidCheck' },
    { service: StickerBlocksService, methodName: 'createStickerBlocks' },
  ])
  async createDraft(
    dto_createDraft: IArticlesServiceCreateDraft,
  ): Promise<ArticleCreateResponseDto> {
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const article: Partial<ArticleDto> = {};
    try {
      Object.keys(dto_createDraft).map((el) => {
        const value = dto_createDraft[el];
        if (dto_createDraft[el] != null) {
          article[el] = value;
        }
      });
      await this.svc_articlesValidate.fkValidCheck({
        articles: article,
        passNonEssentail: !dto_createDraft.isPublished,
      });
      const queryResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Article, Object.keys(article))
        .values(article)
        .execute();

      const articleData = await queryRunner.manager.findOne(Article, {
        where: { id: queryResult.identifiers[0].id },
      });
      const stickerBlockData = await this.svc_stickerBlocks.createStickerBlocks(
        {
          articleId: articleData.id,
          stickerBlocks: dto_createDraft.stickerBlocks,
        },
      );
      await queryRunner.commitTransaction();

      return { articleData, stickerBlockData };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  @MergeExceptionMetadata([
    { service: ImagesService, methodName: 'imageUpload' },
  ])
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
