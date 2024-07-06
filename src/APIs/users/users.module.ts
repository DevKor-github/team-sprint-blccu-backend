import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UtilsService } from 'src/modules/utils/utils.service';
import { UsersRepository } from './users.repository';
import { AwsService } from 'src/modules/aws/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository, AwsService, UtilsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
