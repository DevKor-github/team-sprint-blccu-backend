import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerBlock } from './entities/stickerblock.entity';
import { Repository } from 'typeorm';
import { CreateStickerBlockDto } from './dtos/create-stickerBlock.dto';
import { StickersService } from '../stickers/stickers.service';
import { CreateStickerBlocksDto } from './dtos/create-stickerBlocks.dto';

@Injectable()
export class StickerBlocksService {
  constructor(
    private readonly stickersService: StickersService,
    @InjectRepository(StickerBlock)
    private readonly stickerBlocksRepository: Repository<StickerBlock>,
  ) {}

  async create(createStickerBlockDto: CreateStickerBlockDto) {
    // 순환참조 막기 위해 자체 에러 헨들링
    // await this.postsService.existCheck({
    //   id: createStickerBlockDto.postsId,
    // });
    try {
      await this.stickersService.existCheck({
        id: createStickerBlockDto.stickerId,
      });

      const data = await this.stickerBlocksRepository.save(
        createStickerBlockDto,
      );
      return data;
    } catch (e) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
  }

  async bulkInsert({
    stickerBlocks,
    postsId,
    kakaoId,
  }: CreateStickerBlocksDto) {
    const stickerBlocksToInsert = stickerBlocks.map((stickerBlock) => ({
      ...stickerBlock,
      postsId,
    }));
    return await this.stickerBlocksRepository.save(stickerBlocksToInsert);
  }

  async fetchBlocks({ postsId }) {
    return await this.stickerBlocksRepository.find({
      where: { postsId },
    });
  }

  async deleteBlocks({ kakaoId, postsId }): Promise<void> {
    const blocksToDelete = await this.stickerBlocksRepository.find({
      relations: ['sticker'],
      where: { postsId },
    });
    for (const block of blocksToDelete) {
      if (block.sticker.isReusable === false)
        await this.stickersService.delete({ kakaoId, id: block.id });
      await this.stickerBlocksRepository.remove(block);
    }
    return;
  }

  async updateBlock() {}
}
