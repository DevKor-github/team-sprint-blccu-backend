import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StickerCategory } from './entities/stickerCategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerCategoryMapper } from './entities/stickerCategoryMapper.entity';
import { StickersService } from '../stickers/stickers.service';
import {
  IStickerCategoriesServiceCreateCategory,
  IStickerCategoriesServiceId,
  IStickerCategoriesServiceMapCategory,
  IStickerCategoriesServiceName,
} from './interfaces/stickerCategories.service.interface';
import { UsersValidateService } from '../users/services/users-validate-service';

@Injectable()
export class StickerCategoriesService {
  constructor(
    @InjectRepository(StickerCategory)
    private readonly stickerCategoriesRepository: Repository<StickerCategory>,
    @InjectRepository(StickerCategoryMapper)
    private readonly stickerCategoryMappersRepository: Repository<StickerCategoryMapper>,
    private readonly svc_usersValidate: UsersValidateService,
    private readonly stickersService: StickersService,
  ) {}

  async findCategoryByName({
    name,
  }: IStickerCategoriesServiceName): Promise<StickerCategory> {
    return await this.stickerCategoriesRepository.findOne({ where: { name } });
  }

  async findCategoryById({
    stickerCategoryId,
  }: IStickerCategoriesServiceId): Promise<StickerCategory> {
    return await this.stickerCategoriesRepository.findOne({
      where: { id: stickerCategoryId },
    });
  }
  async existCheckByName({
    name,
  }: IStickerCategoriesServiceName): Promise<void> {
    const data = await this.findCategoryByName({ name });
    if (!data) throw new NotFoundException('스티커 카테고리가 없습니다.');
  }
  async existCheckById({
    stickerCategoryId,
  }: IStickerCategoriesServiceId): Promise<void> {
    const data = await this.findCategoryById({ stickerCategoryId });
    if (!data) throw new NotFoundException('스티커 카테고리가 없습니다.');
  }

  async fetchCategories(): Promise<StickerCategory[]> {
    return await this.stickerCategoriesRepository.find();
  }

  async createCategory({
    userId,
    name,
  }: IStickerCategoriesServiceCreateCategory): Promise<StickerCategory> {
    await this.svc_usersValidate.adminCheck({ userId });
    return await this.stickerCategoriesRepository.save({ name });
  }

  async mapCategory({
    userId,
    maps,
  }: IStickerCategoriesServiceMapCategory): Promise<StickerCategoryMapper[]> {
    await this.svc_usersValidate.adminCheck({ userId });
    maps.forEach(async (map) => {
      await this.existCheckById({ stickerCategoryId: map.stickerCategoryId });
      await this.stickersService.existCheck({
        stickerId: map.stickerId,
      });
    });
    return await this.stickerCategoryMappersRepository.save(maps);
  }

  async fetchStickersByCategoryId({
    stickerCategoryId,
  }: IStickerCategoriesServiceId): Promise<StickerCategoryMapper[]> {
    await this.existCheckById({ stickerCategoryId });
    return await this.stickerCategoryMappersRepository.find({
      relations: { sticker: true, stickerCategory: true },
      where: {
        stickerCategory: { id: stickerCategoryId },
        sticker: { isDefault: true },
      },
    });
  }
}
