import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/posts.entity';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PostsController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  providers: [JwtStrategy],
  controllers: [PostsController],
})
export class PostsModule {}
