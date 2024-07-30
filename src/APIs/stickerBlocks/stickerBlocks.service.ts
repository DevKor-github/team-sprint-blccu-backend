import { Injectable } from '@nestjs/common';
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
import { StickerBlocksWithStickerResponseDto } from './dtos/response/stickerBlocks-with-sticker-response.dto';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class StickerBlocksService {
  constructor(
    private readonly svc_stickers: StickersService,
    @InjectRepository(StickerBlock)
    private readonly repo_stickerBlocks: Repository<StickerBlock>,
  ) {}

  @MergeExceptionMetadata([
    { service: StickersService, methodName: 'existCheck' },
  ])
  async createStickerBlock({
    stickerId,
    articleId,
    ...rest
  }: IStickerBlocksServiceCreateStickerBlock): Promise<StickerBlockDto> {
    await this.svc_stickers.existCheck({
      stickerId: stickerId,
    });

    const data = await this.repo_stickerBlocks.save({
      ...rest,
      articleId,
      stickerId,
    });
    return data;
  }

  @MergeExceptionMetadata([
    { service: StickersService, methodName: 'existCheck' },
  ])
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
        stickerId: stickerBlock.stickerId,
      });
    });
    return await this.repo_stickerBlocks.save(stickerBlocksToInsert);
  }

  async findStickerBlocks({
    articleId,
  }: IStikcerBlocksServiceFetchBlocks): Promise<
    StickerBlocksWithStickerResponseDto[]
  > {
    return await this.repo_stickerBlocks.find({
      relations: ['sticker'],
      where: { articleId },
    });
  }

  @MergeExceptionMetadata([
    { service: StickersService, methodName: 'deleteSticker' },
  ])
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
        await this.svc_stickers.deleteSticker({
          userId,
          stickerId: block.stickerId,
        });
      await this.repo_stickerBlocks.remove(block);
    }
    return;
  }

  async updateStickerBlocks() {}
}
