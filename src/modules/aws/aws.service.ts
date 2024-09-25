// aws.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';

@Injectable()
export class AwsService {
  s3Client: S3Client;
  private readonly logger = new Logger(AwsService.name);

  constructor(private configService: ConfigService) {
    // AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key를 설정.
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'), // AWS Region
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  @ExceptionMetadata([EXCEPTIONS.IMAGE_UPLOAD_TO_S3_ERROR])
  async imageUploadToS3Buffer(fileName: string, file: Buffer, ext: string) {
    try {
      const resizedImageBuffer = await this.resizeImage(file, 800);

      const command = new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
        Key: fileName, // 업로드될 파일의 이름
        Body: resizedImageBuffer, // 업로드할 파일
        ContentType: `image/${ext}`, // 파일 타입,
      });
      await this.s3Client.send(command);
      // return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
      return `https://${this.configService.get('CLOUDFRONT_DOMAIN_NAME')}/${fileName}`;
    } catch (error) {
      this.logger.error('Error uploading image to S3', error.stack);
      throw new BlccuException('IMAGE_UPLOAD_TO_S3_ERROR');
    }
  }
  // @ExceptionMetadata([EXCEPTIONS.IMAGE_DELETE_FROM_S3_ERROR])
  async deleteImageFromS3({ url }) {
    try {
      const fileNameRegex = /\/([^\/]+)\.[^.]+$/;
      const matches = url.match(fileNameRegex);
      const objectKey = matches && matches[1];
      const deleteParams = {
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
        Key: objectKey,
      };
      const command = new DeleteObjectCommand(deleteParams);
      return await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('Error deleting object from S3', error.stack);
      // throw new BlccuException('IMAGE_DELETE_FROM_S3_ERROR');
    }
  }

  @ExceptionMetadata([EXCEPTIONS.IMAGE_UPLOAD_TO_S3_ERROR])
  async imageUploadToS3(
    fileName: string, // 업로드될 파일의 이름
    file: Express.Multer.File, // 업로드할 파일
    ext: string, // 파일 확장자
    resize: number, // 리사이징 크기
  ) {
    try {
      const resizedImageBuffer = await this.resizeImage(file.buffer, resize);
      const key = `${this.configService.get('S3_TAG')}/${fileName}`;
      // AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
      const command = new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
        Key: key, // 업로드될 파일의 이름
        Body: resizedImageBuffer, // 업로드할 파일
        ContentType: `image/${ext}`, // 파일 타입
      });

      // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
      await this.s3Client.send(command);

      // 업로드된 이미지의 URL을 반환합니다.
      return `https://${this.configService.get('CLOUDFRONT_DOMAIN_NAME')}/${key}`;
    } catch (error) {
      this.logger.error('Error uploading image to S3', error.stack);
      throw new BlccuException('IMAGE_UPLOAD_TO_S3_ERROR');
    }
  }

  @ExceptionMetadata([EXCEPTIONS.IMAGE_RESIZE_ERROR])
  async resizeImage(buffer: Buffer, width: number) {
    try {
      const resizedImageBuffer = await sharp(buffer, { failOnError: false })
        .resize({ width, withoutEnlargement: true })
        .toBuffer();
      return resizedImageBuffer;
    } catch (error) {
      this.logger.error('Error resizing image', error.stack);
      throw new BlccuException('IMAGE_RESIZE_ERROR');
    }
  }
}
