import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from './users.repository';
import { ImagesModule } from 'src/modules/images/images.module';
import { UsersCreateService } from './services/users-create.service';
import { UsersReadService } from './services/users-read.service';
import { UsersUpdateService } from './services/users-update.service';
import { UsersDeleteService } from './services/users-delete.service';
import { UsersCreateController } from './controllers/users-create.controller';
import { UsersReadController } from './controllers/users-read.controller';
import { UsersUpdateController } from './controllers/users-update.controller';
import { UsersDeleteController } from './controllers/users-delete.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ImagesModule],
  providers: [
    UsersCreateService,
    UsersReadService,
    UsersUpdateService,
    UsersDeleteService,
    UsersRepository,
  ],
  controllers: [
    UsersCreateController,
    UsersReadController,
    UsersUpdateController,
    UsersDeleteController,
  ],
  exports: [
    UsersCreateService,
    UsersReadService,
    UsersUpdateService,
    UsersDeleteService,
  ],
})
export class UsersModule {}
