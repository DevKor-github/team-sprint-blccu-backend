import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import { StickersController } from './stickers.controller';
import { StickersService } from './stickers.service';
import { UsersModule } from '../users/users.module';
import { ImagesModule } from 'src/modules/images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), UsersModule, ImagesModule],
  providers: [StickersService],
  controllers: [StickersController],
  exports: [StickersService],
})
export class StickersModule {}
