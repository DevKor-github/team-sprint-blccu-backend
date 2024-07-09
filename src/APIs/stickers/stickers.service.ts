import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sticker } from './entities/sticker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersValidateService } from '../users/services/users-validate-service';
import {
  IStickersServiceCreateSticker,
  IStickersServiceDeleteSticker,
  IStickersServiceFindUserStickers,
  IStickersServiceId,
  IStickersServiceUpdateSticker,
} from './interfaces/stickers.service.interface';
import { ImagesService } from 'src/modules/images/images.service';
import { StickerDto } from './dtos/common/sticker.dto';

@Injectable()
export class StickersService {
  constructor(
    @InjectRepository(Sticker)
    private readonly repo_stickers: Repository<Sticker>,
    private readonly svc_usersValidate: UsersValidateService,
    private readonly svc_images: ImagesService,
  ) {}

  async findStickerById({
    stickerId,
  }: IStickersServiceId): Promise<StickerDto> {
    return await this.repo_stickers.findOne({ where: { id: stickerId } });
  }

  async existCheck({ stickerId }: IStickersServiceId): Promise<void> {
    const data = await this.findStickerById({ stickerId });
    if (!data) throw new NotFoundException('스티커를 찾을 수 없습니다.');
  }

  async createPrivateSticker({
    userId,
    file,
  }: IStickersServiceCreateSticker): Promise<StickerDto> {
    const { imageUrl } = await this.svc_images.imageUpload({
      file,
      resize: 1600,
      ext: 'png',
    });
    const insertData = await this.repo_stickers
      .createQueryBuilder()
      .insert()
      .into(Sticker, ['user_id', 'image_url', 'is_default'])
      .values({ userId, imageUrl, isDefault: false })
      .execute();
    const id = insertData.identifiers[0].id;
    const data = await this.repo_stickers.findOne({ where: { id } });
    return data;
  }
  async createPublicSticker({
    userId,
    file,
  }: IStickersServiceCreateSticker): Promise<StickerDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    const { imageUrl } = await this.svc_images.imageUpload({
      file,
      resize: 1600,
      ext: 'png',
    });
    const insertData = await this.repo_stickers
      .createQueryBuilder()
      .insert()
      .into(Sticker, ['user_id', 'image_url', 'is_default', 'is_reusable'])
      .values({ userId, imageUrl, isDefault: true, isReusable: true })
      .execute();
    const id = insertData.identifiers[0].id;
    const data = await this.repo_stickers.findOne({ where: { id } });
    return data;
  }

  async findUserStickers({
    userId,
  }: IStickersServiceFindUserStickers): Promise<StickerDto[]> {
    return await this.repo_stickers.find({
      where: { userId, isReusable: true, isDefault: false },
    });
  }

  async findPublicStickers(): Promise<StickerDto[]> {
    return await this.repo_stickers.find({
      where: { isDefault: true },
    });
  }

  async updateSticker({
    imageUrl,
    isReusable,
    userId,
    stickerId,
  }: IStickersServiceUpdateSticker): Promise<Sticker> {
    try {
      const sticker = await this.repo_stickers.findOne({
        where: { id: stickerId, userId },
      });
      if (!sticker)
        throw new NotFoundException(
          '스티커가 존재하지 않거나 제작자 본인이 아닙니다.',
        );
      if (isReusable) sticker.isReusable = isReusable;
      if (imageUrl) {
        await this.svc_images.deleteImage({ url: sticker.imageUrl });
        sticker.imageUrl = imageUrl;
      }
      const result = await this.repo_stickers.save(sticker);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async deleteSticker({
    stickerId,
    userId,
  }: IStickersServiceDeleteSticker): Promise<void> {
    const sticker = await this.repo_stickers.findOne({
      where: { id: stickerId, userId },
    });
    if (!sticker)
      throw new NotFoundException(
        '스티커가 존재하지 않거나 제작자 본인이 아닙니다.',
      );
    await this.svc_images.deleteImage({
      url: sticker.imageUrl,
    });
    await this.repo_stickers.remove(sticker);
    return;
  }
}
