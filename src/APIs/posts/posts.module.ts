import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/posts.entity';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PostsController } from './posts.controller';
import { UtilsModule } from 'src/utils/utils.module';
import { AwsModule } from 'src/aws/aws.module';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), UtilsModule, AwsModule],
  providers: [JwtStrategy, PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
