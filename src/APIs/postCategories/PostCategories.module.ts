import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from './entities/postCategory.entity';
import { PostCategoriesService } from './PostCategories.service';
import { PostCategoriesController } from './PostCategories.controller';
import { PostCategoriesRepository } from './PostCategories.repository';
import { NeighborsModule } from '../neighbors/neighbors.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory]), NeighborsModule],
  providers: [PostCategoriesService, PostCategoriesRepository],
  controllers: [PostCategoriesController],
})
export class PostCategoriesModule {}
