import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ArticleBackground } from '../articleBackgrounds/entities/articleBackground.entity';
import { ArticleCategory } from '../articleCategories/entities/articleCategory.entity';
import { StickerBlocksModule } from '../stickerBlocks/stickerBlocks.module';
import { FollowsModule } from '../follows/follows.module';
import { Article } from './entities/article.entity';
import { ArticlesReadService } from './services/articles-read.service';
import { ArticlesCreateService } from './services/articles-create.service';
import { ArticlesDeleteService } from './services/articles-delete.service';
import { ArticlesUpdateService } from './services/articles-update.service';
import { ArticlesPaginateService } from './services/articles-paginate.service';
import { ArticlesCreateRepository } from './repositories/articles-create.repository';
import { ArticlesReadRepository } from './repositories/articles-read.repository';
import { ArticlesUpdateRepository } from './repositories/articles-update.repository';
import { ArticlesDeleteRepository } from './repositories/articles-delete.repository';
import { ArticlesPaginateRepository } from './repositories/articles-paginate.repository';
import { ArticlesCreateController } from './controllers/articles-create.controller';
import { ArticlesReadController } from './controllers/articles-read.controller';
import { ArticlesUpdateController } from './controllers/articles-update.controller';
import { ArticlesDeleteController } from './controllers/articles-delete.controller';
import { ArticlesValidateService } from './services/articles-validate.service';
import { ImagesModule } from 'src/modules/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleBackground, ArticleCategory]),
    ImagesModule,
    FollowsModule,
    StickerBlocksModule,
  ],
  providers: [
    ArticlesCreateService,
    ArticlesReadService,
    ArticlesUpdateService,
    ArticlesDeleteService,
    ArticlesValidateService,
    ArticlesPaginateService,
    ArticlesCreateRepository,
    ArticlesReadRepository,
    ArticlesUpdateRepository,
    ArticlesDeleteRepository,
    ArticlesPaginateRepository,
  ],
  controllers: [
    ArticlesCreateController,
    ArticlesReadController,
    ArticlesUpdateController,
    ArticlesDeleteController,
  ],
  exports: [],
})
export class ArticlesModule {}
