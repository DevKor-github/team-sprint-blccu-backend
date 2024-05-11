import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { Follow } from './entities/follow.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Follow, User])],
  providers: [FollowsService],
  controllers: [FollowsController],
  exports: [FollowsService],
})
export class FollowsModule {}
