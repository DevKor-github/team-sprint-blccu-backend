import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleBackground } from './entities/articleBackground.entity';
import { Repository } from 'typeorm';
import { ImagesService } from 'src/modules/images/images.service';
import { ArticleBackgroundDto } from './dtos/common/articleBackground.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { UsersValidateService } from '../users/services/users-validate-service';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class ArticleBackgroundsService {
  constructor(
    private readonly svc_images: ImagesService,
    private readonly svc_usersValidate: UsersValidateService,
    @InjectRepository(ArticleBackground)
    private readonly repo_articleBackgrounds: Repository<ArticleBackground>,
  ) {}

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
    { service: ImagesService, methodName: 'imageUpload' },
  ])
  async createArticleBackground(
    userId: number,
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    const { imageUrl } = await this.svc_images.imageUpload({
      file,
      resize: 2000,
      ext: 'png',
      tag: 'articles/images/backgrounds',
    });
    await this.repo_articleBackgrounds.save({ imageUrl });
    return { imageUrl };
  }

  async findArticleBackgrounds(): Promise<ArticleBackgroundDto[]> {
    return await this.repo_articleBackgrounds.find();
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
    { service: ImagesService, methodName: 'deleteImage' },
  ])
  async deleteArticleBackground({ articleBackgroundId, userId }) {
    await this.svc_usersValidate.adminCheck({ userId });

    const articleBackground = await this.repo_articleBackgrounds.findOne({
      where: { id: articleBackgroundId },
    });
    await this.repo_articleBackgrounds.remove(articleBackground);
    await this.svc_images.deleteImage({ url: articleBackground.imageUrl });
  }
}
