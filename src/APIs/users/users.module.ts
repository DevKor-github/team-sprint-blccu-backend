import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AwsService } from 'src/utils/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AwsService, UtilsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
