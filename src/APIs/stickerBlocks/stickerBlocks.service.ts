import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerBlock } from './entities/stickerblock.entity';
import { Repository } from 'typeorm';
import { StickersService } from '../stickers/stickers.service';
import {
  IStickerBlocksServiceCreateStickerBlock,
  IStickerBlocksServiceCreateStickerBlocks,
  IStikcerBlocksServiceDeleteBlocks,
  IStikcerBlocksServiceFetchBlocks,
} from './interfaces/stickerBlocks.service.interface';
import { StickerBlockDto } from './dtos/common/stickerBlock.dto';

@Injectable()
export class StickerBlocksService {
  constructor(
    private readonly stickersService: StickersService,
    @InjectRepository(StickerBlock)
    private readonly stickerBlocksRepository: Repository<StickerBlock>,
  ) {}

  async createStickerBlock({
    stickerId,
    articleId,
    ...rest
  }: IStickerBlocksServiceCreateStickerBlock): Promise<StickerBlockDto> {
    try {
      await this.stickersService.existCheck({
        id: stickerId,
      });

      const data = await this.stickerBlocksRepository.save({
        ...rest,
        articleId,
        stickerId,
      });
      return data;
    } catch (e) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
  }

  async createStickerBlocks({
    stickerBlocks,
    articleId,
  }: IStickerBlocksServiceCreateStickerBlocks): Promise<StickerBlockDto[]> {
    const stickerBlocksToInsert = stickerBlocks.map((stickerBlock) => ({
      ...stickerBlock,
      articleId,
    }));
    stickerBlocksToInsert.forEach(async (stickerBlock) => {
      await this.stickersService.existCheck({
        id: stickerBlock.stickerId,
      });
    });
    return await this.stickerBlocksRepository.save(stickerBlocksToInsert);
  }

  async findStickerBlocks({
    articleId,
  }: IStikcerBlocksServiceFetchBlocks): Promise<StickerBlockDto[]> {
    return await this.stickerBlocksRepository.find({
      where: { articleId },
    });
  }

  async deleteStickerBlocks({
    userId,
    articleId,
  }: IStikcerBlocksServiceDeleteBlocks): Promise<void> {
    const blocksToDelete = await this.stickerBlocksRepository.find({
      relations: ['sticker'],
      where: { articleId },
    });
    for (const block of blocksToDelete) {
      if (block.sticker.isReusable === false)
        await this.stickersService.delete({ userId, id: block.id });
      await this.stickerBlocksRepository.remove(block);
    }
    return;
  }

  async updateStickerBlocks() {}
}
