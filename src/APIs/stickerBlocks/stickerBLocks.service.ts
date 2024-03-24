import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerBlock } from './entities/stickerblock.entity';
import { Repository } from 'typeorm';
import { CreateStickerBlockDto } from './dto/create-stickerBlock.dto';
import { StickersService } from '../stickers/stickers.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class StickerBlocksService {
  constructor(
    private readonly stickersService: StickersService,
    private readonly postsService: PostsService,
    @InjectRepository(StickerBlock)
    private readonly stickerBlocksRepository: Repository<StickerBlock>,
  ) {}

  async create(createStickerBlockDto: CreateStickerBlockDto) {
    await this.postsService.existCheck({
      id: createStickerBlockDto.postsId,
    });
    await this.stickersService.existCheck({
      id: createStickerBlockDto.stickerId,
    });
    return await this.stickerBlocksRepository.save(createStickerBlockDto);
  }
}
