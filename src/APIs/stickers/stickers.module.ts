import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Sticker } from './entities/sticker.entity';
import { StickersController } from './stickers.controller';
import { StickersService } from './stickers.service';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker])],
  providers: [JwtStrategy, StickersService, AwsService, UtilsService],
  controllers: [StickersController],
})
export class StickersModule {}
