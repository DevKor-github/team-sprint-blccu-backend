import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { StickerCategory } from './entities/stickerCategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StickerCategoryMapper } from './entities/stickerCategoryMapper.entity';
import { StickersService } from '../stickers/stickers.service';
import {
  IStickerCategoriesServiceCreateCategory,
  IStickerCategoriesServiceId,
  IStickerCategoriesServiceIds,
  IStickerCategoriesServiceMapCategory,
  IStickerCategoriesServiceName,
} from './interfaces/stickerCategories.service.interface';
import { UsersValidateService } from '../users/services/users-validate-service';
import { StickerCategoryDto } from './dtos/common/stickerCategory.dto';
import { StickerCategoryMapperDto } from './dtos/common/stickerCategoryMapper.dto';
import { StickersCategoryFetchStickersResponseDto } from './dtos/response/stickerCategories-fetch-stickers-response.dto';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class StickerCategoriesService {
  constructor(
    @InjectRepository(StickerCategory)
    private readonly repo_stickerCategories: Repository<StickerCategory>,
    @InjectRepository(StickerCategoryMapper)
    private readonly repo_stickerCategoryMappers: Repository<StickerCategoryMapper>,
    private readonly svc_usersValidate: UsersValidateService,
    private readonly svc_stickers: StickersService,
  ) {}

  async findCategoryByName({
    name,
  }: IStickerCategoriesServiceName): Promise<StickerCategoryDto> {
    return await this.repo_stickerCategories.findOne({ where: { name } });
  }

  async findCategoryById({
    stickerCategoryId,
  }: IStickerCategoriesServiceId): Promise<StickerCategoryDto> {
    return await this.repo_stickerCategories.findOne({
      where: { id: stickerCategoryId },
    });
  }

  @ExceptionMetadata([EXCEPTIONS.CATEGORY_CONFLICT])
  async existCheckByName({
    name,
  }: IStickerCategoriesServiceName): Promise<void> {
    const data = await this.findCategoryByName({ name });
    if (data) throw new BlccuException('CATEGORY_CONFLICT');
  }

  @ExceptionMetadata([EXCEPTIONS.STICKER_CATEGORY_NOT_FOUND])
  async existCheckById({
    stickerCategoryId,
  }: IStickerCategoriesServiceId): Promise<void> {
    const data = await this.findCategoryById({ stickerCategoryId });
    if (!data) throw new BlccuException('STICKER_CATEGORY_NOT_FOUND');
  }

  @ExceptionMetadata([EXCEPTIONS.MAPPING_CONFLICT])
  async existCheckMapper({
    stickerId,
    stickerCategoryId,
  }: IStickerCategoriesServiceIds): Promise<void> {
    const data = await this.repo_stickerCategoryMappers.findOne({
      where: { stickerId, stickerCategoryId },
    });
    if (data) throw new BlccuException('MAPPING_CONFLICT');
  }
  async fetchCategories(): Promise<StickerCategoryDto[]> {
    return await this.repo_stickerCategories.find();
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
    { service: StickerCategoriesService, methodName: 'existCheckByName' },
  ])
  async createCategory({
    userId,
    name,
  }: IStickerCategoriesServiceCreateCategory): Promise<StickerCategoryDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    await this.existCheckByName({ name });
    return await this.repo_stickerCategories.save({ name });
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
    { service: StickersService, methodName: 'existCheck' },
    { service: StickerCategoriesService, methodName: 'existCheckMapper' },
    { service: StickerCategoriesService, methodName: 'existCheckById' },
  ])
  async mapCategory({
    userId,
    maps,
  }: IStickerCategoriesServiceMapCategory): Promise<
    StickerCategoryMapperDto[]
  > {
    await this.svc_usersValidate.adminCheck({ userId });
    for (const map of maps) {
      await this.existCheckById({ stickerCategoryId: map.stickerCategoryId });
      await this.svc_stickers.existCheck({
        stickerId: map.stickerId,
      });
      await this.existCheckMapper({
        stickerCategoryId: map.stickerCategoryId,
        stickerId: map.stickerId,
      });
    }
    return await this.repo_stickerCategoryMappers.save(maps);
  }

  @MergeExceptionMetadata([
    { service: StickerCategoriesService, methodName: 'existCheckById' },
  ])
  async fetchStickersByCategoryId({
    stickerCategoryId,
  }: IStickerCategoriesServiceId): Promise<
    StickersCategoryFetchStickersResponseDto[]
  > {
    await this.existCheckById({ stickerCategoryId });
    return await this.repo_stickerCategoryMappers.find({
      relations: { sticker: true },
      where: {
        stickerCategory: { id: stickerCategoryId },
        sticker: { isDefault: true },
      },
    });
  }
}
