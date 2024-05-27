import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../posts/entities/posts.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Likes } from './entities/like.entity';
import { LikesRepository } from './likes.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Likes]), NotificationsModule],
  providers: [LikesService, LikesRepository],
  controllers: [LikesController],
})
export class LikesModule {}
