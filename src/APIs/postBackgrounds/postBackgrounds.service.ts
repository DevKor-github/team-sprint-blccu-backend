import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/utils/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { PostBackground } from './entities/postBackground.entity';
import { Repository } from 'typeorm';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';

@Injectable()
export class PostBackgroundsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    @InjectRepository(PostBackground)
    private readonly postBackgroundsRepository: Repository<PostBackground>,
  ) {}
  async saveImage(file: Express.Multer.File): Promise<ImageUploadResponseDto> {
    return await this.imageUpload(file);
  }

  async imageUpload(
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const image_url = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );
    await this.postBackgroundsRepository.save({ image_url });
    return { image_url };
  }

  async fetchAll(): Promise<PostBackground[]> {
    return await this.postBackgroundsRepository.find();
  }

  async delete({ id }) {
    // s3 서버에서 이미지 삭제하는 것까지 구현하기!!
    return await this.postBackgroundsRepository.delete({ id });
  }
}
