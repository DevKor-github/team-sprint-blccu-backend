import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { ImagesModule } from 'src/modules/images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ImagesModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
