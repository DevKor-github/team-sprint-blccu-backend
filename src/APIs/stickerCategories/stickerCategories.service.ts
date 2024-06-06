import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StickerCategory } from './entities/stickerCategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerCategoryMapper } from './entities/stickerCategoryMapper.entity';
import { UsersService } from '../users/users.service';
import { StickersService } from '../stickers/stickers.service';
import {
  IStickerCategoriesServiceCreateCategory,
  IStickerCategoriesServiceId,
  IStickerCategoriesServiceMapCategory,
  IStickerCategoriesServiceName,
} from './interfaces/stickerCategories.service.interface';

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

  async findCategoryByName({ name }: IStickerCategoriesServiceName) {
    return await this.stickerCategoriesRepository.findOne({ where: { name } });
  }

  async findCategoryById({ id }: IStickerCategoriesServiceId) {
    return await this.stickerCategoriesRepository.findOne({ where: { id } });
  }
  async existCheckByName({ name }: IStickerCategoriesServiceName) {
    const data = await this.findCategoryByName({ name });
    if (!data) throw new NotFoundException('스티커 카테고리가 없습니다.');
  }
  async existCheckById({ id }: IStickerCategoriesServiceId) {
    const data = await this.findCategoryById({ id });
    if (!data) throw new NotFoundException('스티커 카테고리가 없습니다.');
  }

  async fetchCategories() {
    return await this.stickerCategoriesRepository.find();
  }

  async createCategory({
    kakaoId,
    name,
  }: IStickerCategoriesServiceCreateCategory) {
    await this.usersService.adminCheck({ kakaoId });
    return await this.stickerCategoriesRepository.save({ name });
  }

  async mapCategory({ kakaoId, maps }: IStickerCategoriesServiceMapCategory) {
    await this.usersService.adminCheck({ kakaoId });
    maps.forEach(async (map) => {
      await this.existCheckById({ id: map.stickerCategoryId });
      await this.stickersService.existCheck({ id: map.stickerId });
    });
    return await this.stickerCategoryMappersRepository.save(maps);
  }

  async fetchStickersByCategoryId({ id }: IStickerCategoriesServiceId) {
    await this.existCheckById({ id });
    return await this.stickerCategoryMappersRepository.find({
      relations: { sticker: true, stickerCategory: true },
      where: { stickerCategory: { id }, sticker: { isDefault: true } },
    });
  }
}
