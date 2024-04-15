import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StickerBlock } from './entities/stickerblock.entity';
import { StickerBlocksController } from './stickerBlocks.controller';
import { StickersModule } from '../stickers/stickers.module';
import { StickerBlocksService } from './stickerBlocks.service';

@Module({
  imports: [TypeOrmModule.forFeature([StickerBlock]), StickersModule],
  providers: [StickerBlocksService],
  controllers: [StickerBlocksController],
  exports: [StickerBlocksService],
})
export class StickerBlocksModule {}
