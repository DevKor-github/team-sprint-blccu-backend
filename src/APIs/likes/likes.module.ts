import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { LikesRepository } from './likes.repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { Like } from './entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), NotificationsModule],
  providers: [LikesService, LikesRepository],
  controllers: [LikesController],
})
export class LikesModule {}
