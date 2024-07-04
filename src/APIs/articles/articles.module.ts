import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { ArticlesService } from './articles.service';
import { ArticleBackground } from '../articleBackgrounds/entities/articleBackground.entity';
import { ArticleCategory } from '../articleCategories/entities/articleCategory.entity';
import { StickerBlocksModule } from '../stickerBlocks/stickerBlocks.module';
import { ArticlesRepository } from './repositories/articles.repository';
import { FollowsModule } from '../follows/follows.module';
import { AwsModule } from 'src/modules/aws/aws.module';
import { ArticlesController } from './controllers/articles.controller';
import { Article } from './entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      User,
      ArticleBackground,
      ArticleCategory,
    ]),
    UtilsModule,
    AwsModule,
    FollowsModule,
    StickerBlocksModule,
  ],
  providers: [ArticlesService, ArticlesRepository],
  controllers: [ArticlesController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
