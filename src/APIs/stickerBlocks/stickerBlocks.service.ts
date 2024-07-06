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
    private readonly svc_stickers: StickersService,
    @InjectRepository(StickerBlock)
    private readonly repo_stickerBlocks: Repository<StickerBlock>,
  ) {}

  async createStickerBlock({
    stickerId,
    articleId,
    ...rest
  }: IStickerBlocksServiceCreateStickerBlock): Promise<StickerBlockDto> {
    try {
      await this.svc_stickers.existCheck({
        id: stickerId,
      });

      const data = await this.repo_stickerBlocks.save({
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
      await this.svc_stickers.existCheck({
        id: stickerBlock.stickerId,
      });
    });
    return await this.repo_stickerBlocks.save(stickerBlocksToInsert);
  }

  async findStickerBlocks({
    articleId,
  }: IStikcerBlocksServiceFetchBlocks): Promise<StickerBlockDto[]> {
    return await this.repo_stickerBlocks.find({
      where: { articleId },
    });
  }

  async deleteStickerBlocks({
    userId,
    articleId,
  }: IStikcerBlocksServiceDeleteBlocks): Promise<void> {
    const blocksToDelete = await this.repo_stickerBlocks.find({
      relations: ['sticker'],
      where: { articleId },
    });
    for (const block of blocksToDelete) {
      if (block.sticker.isReusable === false)
        await this.svc_stickers.delete({ userId, id: block.id });
      await this.repo_stickerBlocks.remove(block);
    }
    return;
  }

  async updateStickerBlocks() {}
}
