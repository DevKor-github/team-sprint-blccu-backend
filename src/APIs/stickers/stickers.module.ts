import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sticker } from './entities/sticker.entity';
import { StickersController } from './stickers.controller';
import { StickersService } from './stickers.service';
import { AwsService } from 'src/utils/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), UsersModule],
  providers: [StickersService, AwsService, UtilsService],
  controllers: [StickersController],
  exports: [StickersService],
})
export class StickersModule {}
