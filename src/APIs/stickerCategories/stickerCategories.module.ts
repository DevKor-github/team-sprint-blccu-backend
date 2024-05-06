import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StickerCategory } from './entities/stickerCategory.entity';
import { StickerCategoryMapper } from './entities/stickerCategoryMapper.entity';
import { StickerCategoriesService } from './stickerCategories.service';
import { StickerCategoriesController } from './stickerCategories.controller';
import { UsersModule } from '../users/users.module';
import { StickersModule } from '../stickers/stickers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StickerCategory, StickerCategoryMapper]),
    UsersModule,
    StickersModule,
  ],
  providers: [StickerCategoriesService],
  controllers: [StickerCategoriesController],
})
export class StickerCategoriesModule {}
