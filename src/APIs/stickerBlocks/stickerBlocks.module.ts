import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

import { StickerBlock } from './entities/stickerblock.entity';
import { StickerBlocksController } from './stickerBlocks.controller';
import { StickerBlocksService } from './stickerBLocks.service';
import { StickersService } from '../stickers/stickers.service';
import { PostsModule } from '../posts/posts.module';
import { StickersModule } from '../stickers/stickers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StickerBlock]),
    PostsModule,
    StickersModule,
  ],
  providers: [JwtStrategy, StickerBlocksService],
  controllers: [StickerBlocksController],
})
export class StickerBlocksModule {}
