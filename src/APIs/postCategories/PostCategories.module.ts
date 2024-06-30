import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from './entities/postCategory.entity';
import { PostCategoriesService } from './PostCategories.service';
import { PostCategoriesController } from './PostCategories.controller';
import { PostCategoriesRepository } from './PostCategories.repository';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory]), FollowsModule],
  providers: [PostCategoriesService, PostCategoriesRepository],
  controllers: [PostCategoriesController],
})
export class PostCategoriesModule {}
