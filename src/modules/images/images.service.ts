import { Injectable } from '@nestjs/common';
import {
  IImagesServiceDeleteImage,
  IImagesServiceUploadImage,
} from './interfaces/images.service.interface';
import { ImageUploadResponseDto } from './dtos/image-upload-response.dto';
import { getUUID } from 'src/utils/uuidUtils';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class ImagesService {
  constructor(private readonly svc_aws: AwsService) {}

  async imageUpload({
    file,
    resize,
    ext,
  }: IImagesServiceUploadImage): Promise<ImageUploadResponseDto> {
    const imageName = getUUID();
    const imageUrl = await this.svc_aws.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
      resize,
    );
    return { imageUrl };
  }

  async deleteImage({ url }: IImagesServiceDeleteImage): Promise<void> {
    await this.svc_aws.deleteImageFromS3({ url });
  }
}
