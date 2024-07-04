import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { PostsController } from './articles.controller';
import { UtilsModule } from 'src/utils/utils.module';
import { PostsService } from './articles.service';
import { PostBackground } from '../postBackgrounds/entities/postBackground.entity';
import { PostCategory } from '../postCategories/entities/postCategory.entity';
import { StickerBlocksModule } from '../stickerBlocks/stickerBlocks.module';
import { PostsRepository } from './articles.repository';
import { FollowsModule } from '../follows/follows.module';
import { AwsModule } from 'src/modules/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, User, PostBackground, PostCategory]),
    UtilsModule,
    AwsModule,
    FollowsModule,
    StickerBlocksModule,
  ],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
