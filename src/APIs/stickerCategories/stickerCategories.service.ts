import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StickerCategory } from './entities/stickerCategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerCategoryMapper } from './entities/stickerCategoryMapper.entity';
import { UsersService } from '../users/users.service';
import { StickersService } from '../stickers/stickers.service';

@Injectable()
export class StickerCategoriesService {
  constructor(
    @InjectRepository(StickerCategory)
    private readonly stickerCategoriesRepository: Repository<StickerCategory>,
    @InjectRepository(StickerCategoryMapper)
    private readonly stickerCategoryMappersRepository: Repository<StickerCategoryMapper>,
    private readonly usersService: UsersService,
    private readonly stickersService: StickersService,
  ) {}

  async findCategoryByName({ name }) {
    return await this.stickerCategoriesRepository.findOne({ where: { name } });
  }

  async findCategoryById({ id }) {
    return await this.stickerCategoriesRepository.findOne({ where: { id } });
  }
  async existCheckByName({ name }) {
    const data = await this.findCategoryByName({ name });
    if (!data) throw new NotFoundException('스티커 카테고리가 없습니다.');
  }
  async existCheckById({ id }) {
    const data = await this.findCategoryById({ id });
    if (!data) throw new NotFoundException('스티커 카테고리가 없습니다.');
  }

  async fetchCategories() {
    return await this.stickerCategoriesRepository.find();
  }

  async createCategory({ kakaoId, name }) {
    await this.usersService.adminCheck({ kakaoId });
    return await this.stickerCategoriesRepository.save({ name });
  }

  async mapCategory({ kakaoId, stickerId, stickerCategoryId }) {
    await this.usersService.adminCheck({ kakaoId });
    await this.stickersService.existCheck({ id: stickerId });
    await this.existCheckById({ id: stickerCategoryId });
    return await this.stickerCategoryMappersRepository
      .createQueryBuilder()
      .insert()
      .into(StickerCategoryMapper, ['stickerId', 'stickerCategoryId'])
      .values({ stickerId, stickerCategoryId })
      .orIgnore()
      .execute();
  }

  async fetchStickersByCategoryName({ name }) {
    await this.existCheckByName({ name });
    return await this.stickerCategoryMappersRepository.find({
      relations: { sticker: true, stickerCategory: true },
      where: { stickerCategory: { name }, sticker: { isDefault: true } },
    });
  }
}
