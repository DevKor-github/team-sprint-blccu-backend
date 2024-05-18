import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { Follow } from './entities/follow.entity';
import { FollowsRepository } from './follows.repository';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Follow, User])],
  providers: [FollowsService, FollowsRepository],
  controllers: [FollowsController],
  exports: [FollowsService],
})
export class FollowsModule {}
