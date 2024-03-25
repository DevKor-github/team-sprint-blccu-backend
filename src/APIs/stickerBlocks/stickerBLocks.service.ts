import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerBlock } from './entities/stickerblock.entity';
import { Repository } from 'typeorm';
import { CreateStickerBlockDto } from './dto/create-stickerBlock.dto';
import { StickersService } from '../stickers/stickers.service';

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

  async fetchBlocks({ postsId }) {
    return await this.stickerBlocksRepository.find({
      where: { postsId },
    });
  }

  async updateBlock() {}
}
