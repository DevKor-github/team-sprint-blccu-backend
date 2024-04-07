import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule],
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
