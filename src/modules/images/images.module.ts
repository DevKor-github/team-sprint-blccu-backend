import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
