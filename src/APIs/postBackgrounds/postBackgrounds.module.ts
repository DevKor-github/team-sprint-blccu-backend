import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UtilsModule } from 'src/utils/utils.module';
import { AwsModule } from 'src/utils/aws/aws.module';
import { PostBackground } from './entities/postBackground.entity';
import { PostBackgroundsService } from './postBackgrounds.service';
import { PostBackgroundsController } from './postBackgrounds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostBackground]), UtilsModule, AwsModule],
  providers: [JwtStrategy, PostBackgroundsService],
  controllers: [PostBackgroundsController],
})
export class PostBackgroundsModule {}
