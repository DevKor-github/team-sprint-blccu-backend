import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../posts/entities/posts.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Like])],
  providers: [JwtStrategy, LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
