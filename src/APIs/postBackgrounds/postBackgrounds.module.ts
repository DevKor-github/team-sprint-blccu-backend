import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UtilsModule } from 'src/utils/utils.module';
import { PostBackground } from './entities/postBackground.entity';
import { PostBackgroundsService } from './postBackgrounds.service';
import { PostBackgroundsController } from './postBackgrounds.controller';
import { AwsModule } from 'src/modules/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostBackground]), UtilsModule, AwsModule],
  providers: [JwtStrategy, PostBackgroundsService],
  controllers: [PostBackgroundsController],
})
export class PostBackgroundsModule {}
