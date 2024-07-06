import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UtilsService } from 'src/modules/utils/utils.service';
import { ArticleBackground } from './entities/articleBackground.entity';
import { Repository } from 'typeorm';
import { ImageUploadResponseDto } from 'src/common/dtos/image-upload-response.dto';
import { AwsService } from 'src/modules/aws/aws.service';

@Injectable()
export class ArticleBackgroundsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    @InjectRepository(ArticleBackground)
    private readonly articleBackgroundsRepository: Repository<ArticleBackground>,
  ) {}
  async saveImage(file: Express.Multer.File): Promise<ImageUploadResponseDto> {
    return await this.imageUpload(file);
  }

  async imageUpload(
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
      2000,
    );
    await this.articleBackgroundsRepository.save({ imageUrl });
    return { imageUrl };
  }

  async fetchAll(): Promise<ArticleBackground[]> {
    return await this.articleBackgroundsRepository.find();
  }

  async delete({ id }) {
    // s3 서버에서 이미지 삭제하는 것까지 구현하기!!
    return await this.articleBackgroundsRepository.delete({ id });
  }
}
