import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleBackground } from './entities/articleBackground.entity';
import { Repository } from 'typeorm';
import { ImagesService } from 'src/modules/images/images.service';
import { ArticleBackgroundDto } from './dtos/common/articleBackground.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';

@Injectable()
export class ArticleBackgroundsService {
  constructor(
    @InjectRepository(ArticleBackground)
    private readonly repo_articleBackgrounds: Repository<ArticleBackground>,
    private readonly svc_images: ImagesService,
  ) {}

  async createArticleBackground(
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const { imageUrl } = await this.svc_images.imageUpload({
      file,
      resize: 2000,
      ext: 'png',
    });
    await this.repo_articleBackgrounds.save({ imageUrl });
    return { imageUrl };
  }

  async findArticleBackgrounds(): Promise<ArticleBackgroundDto[]> {
    return await this.repo_articleBackgrounds.find();
  }

  async deleteArticleBackground({ articleBackgroundId }) {
    const articleBackground = await this.repo_articleBackgrounds.findOne({
      where: { id: articleBackgroundId },
    });
    await this.repo_articleBackgrounds.remove(articleBackground);
    await this.svc_images.deleteImage({ url: articleBackground.imageUrl });
  }
}
