import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UtilsModule } from 'src/modules/utils/utils.module';
import { ArticleBackgroundsController } from './articleBackgrounds.controller';
import { AwsModule } from 'src/modules/aws/aws.module';
import { ArticleBackgroundsService } from './articleBackgrounds.service';
import { ArticleBackground } from './entities/articleBackground.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleBackground]),
    UtilsModule,
    AwsModule,
  ],
  providers: [JwtStrategy, ArticleBackgroundsService],
  controllers: [ArticleBackgroundsController],
})
export class ArticleBackgroundsModule {}
