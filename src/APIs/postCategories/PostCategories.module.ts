import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PostCategory } from './entities/postCategory.entity';
import { PostCategoriesService } from './PostCategories.service';
import { PostCategoriesController } from './PostCategories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  providers: [JwtStrategy, PostCategoriesService],
  controllers: [PostCategoriesController],
})
export class PostCategoriesModule {}
