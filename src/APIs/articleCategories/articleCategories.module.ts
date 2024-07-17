import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowsModule } from '../follows/follows.module';
import { ArticleCategory } from './entities/articleCategory.entity';
import { ArticleCategoriesRepository } from './articleCategories.repository';
import { ArticleCategoriesService } from './articleCategories.service';
import { ArticleCategoriesController } from './articleCategories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleCategory]), FollowsModule],
  providers: [ArticleCategoriesService, ArticleCategoriesRepository],
  controllers: [ArticleCategoriesController],
})
export class ArticleCategoriesModule {}
