import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ArticleBackgroundsController } from './articleBackgrounds.controller';
import { ArticleBackgroundsService } from './articleBackgrounds.service';
import { ArticleBackground } from './entities/articleBackground.entity';
import { ImagesModule } from 'src/modules/images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleBackground]), ImagesModule],
  providers: [JwtStrategy, ArticleBackgroundsService],
  controllers: [ArticleBackgroundsController],
})
export class ArticleBackgroundsModule {}
