import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PostsController } from './posts.controller';
import { UtilsModule } from 'src/utils/utils.module';
import { AwsModule } from 'src/aws/aws.module';
import { PostsService } from './posts.service';
import { Neighbor } from '../neighbors/entities/neighbor.entity';
import { PostBackground } from '../postBackgrounds/entities/postBackground.entity';
import { PostCategory } from '../postCategories/entities/postCategory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Posts,
      User,
      Neighbor,
      PostBackground,
      PostCategory,
    ]),
    UtilsModule,
    AwsModule,
  ],
  providers: [JwtStrategy, PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
