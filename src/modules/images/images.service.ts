import { Injectable } from '@nestjs/common';
import {
  IImagesServiceDeleteImage,
  IImagesServiceUploadImage,
} from './interfaces/images.service.interface';
import { ImageUploadResponseDto } from './dtos/image-upload-response.dto';
import { getUUID } from '@/utils/uuid.utils';
import { AwsService } from '../aws/aws.service';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class ImagesService {
  constructor(private readonly svc_aws: AwsService) {}

  @MergeExceptionMetadata([
    { service: AwsService, methodName: 'imageUploadToS3' },
  ])
  async imageUpload({
    file,
    resize,
    ext,
    tag,
  }: IImagesServiceUploadImage): Promise<ImageUploadResponseDto> {
    const imageName = getUUID();
    const imageUrl = await this.svc_aws.imageUploadToS3(
      `${tag}/${imageName}.${ext}`,
      file,
      ext,
      resize,
    );
    return { imageUrl };
  }

  @MergeExceptionMetadata([
    { service: AwsService, methodName: 'deleteImageFromS3' },
  ])
  async deleteImage({ url }: IImagesServiceDeleteImage): Promise<void> {
    await this.svc_aws.deleteImageFromS3({ url });
  }
}
