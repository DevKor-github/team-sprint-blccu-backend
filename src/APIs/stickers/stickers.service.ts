import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sticker } from './entities/sticker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStickerDto } from './dtos/create-sticker.dto';
import { AwsService } from 'src/utils/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { UsersService } from '../users/users.service';
import { UpdateStickerDto } from './dtos/update-sticker.dto';
import {
  IStickersServiceDelete,
  IStickersServiceFetchUserStickers,
  IStickersServiceId,
} from './interfaces/stickers.service.interface';

@Injectable()
export class StickersService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    @InjectRepository(Sticker)
    private readonly stickersRepository: Repository<Sticker>,
    private readonly usersService: UsersService,
  ) {}

  async findStickerById({ id }: IStickersServiceId): Promise<Sticker> {
    return await this.stickersRepository.findOne({ where: { id } });
  }

  async existCheck({ id }: IStickersServiceId): Promise<void> {
    const data = await this.findStickerById({ id });
    if (!data) throw new NotFoundException('스티커를 찾을 수 없습니다.');
  }

  async imageUpload(
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const image_url = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
      1600,
    );
    return { image_url };
  }
  async createPrivateSticker({
    userKakaoId,
    file,
  }: CreateStickerDto): Promise<Sticker> {
    const { image_url } = await this.imageUpload(file);
    const insertData = await this.stickersRepository
      .createQueryBuilder()
      .insert()
      .into(Sticker, ['userKakaoId', 'image_url', 'isDefault'])
      .values({ userKakaoId, image_url, isDefault: false })
      .orUpdate(['image_url', 'isDefault'], ['id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
    const id = insertData.identifiers[0].id;
    const data = await this.stickersRepository.findOne({ where: { id } });
    return data;
  }
  async createPublicSticker({
    userKakaoId,
    file,
  }: CreateStickerDto): Promise<Sticker> {
    await this.usersService.adminCheck({ kakaoId: userKakaoId });
    const { image_url } = await this.imageUpload(file);
    const insertData = await this.stickersRepository
      .createQueryBuilder()
      .insert()
      .into(Sticker, ['userKakaoId', 'image_url', 'isDefault', 'isReusable'])
      .values({ userKakaoId, image_url, isDefault: true, isReusable: true })
      .orUpdate(['image_url', 'isDefault', 'isReusable'], ['id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
    const id = insertData.identifiers[0].id;
    const data = await this.stickersRepository.findOne({ where: { id } });
    return data;
  }

  async fetchUserStickers({
    userKakaoId,
  }: IStickersServiceFetchUserStickers): Promise<Sticker[]> {
    return await this.stickersRepository.find({
      where: { userKakaoId, isReusable: true, isDefault: false },
    });
  }

  async fetchPublicStickers(): Promise<Sticker[]> {
    return await this.stickersRepository.find({
      where: { isDefault: true },
    });
  }

  async updateSticker({
    image_url,
    isReusable,
    kakaoId,
    id,
  }: UpdateStickerDto): Promise<Sticker> {
    try {
      const sticker = await this.stickersRepository.findOne({
        where: { id, user: { kakaoId } },
      });
      if (!sticker)
        throw new NotFoundException(
          '스티커가 존재하지 않거나 제작자 본인이 아닙니다.',
        );
      if (isReusable) sticker.isReusable = isReusable;
      if (image_url) {
        await this.awsService.deleteImageFromS3({ url: sticker.image_url });
        sticker.image_url = image_url;
      }
      const result = await this.stickersRepository.save(sticker);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async delete({ id, kakaoId }: IStickersServiceDelete): Promise<void> {
    const sticker = await this.stickersRepository.findOne({
      where: { id, user: { kakaoId } },
    });
    if (!sticker)
      throw new NotFoundException(
        '스티커가 존재하지 않거나 제작자 본인이 아닙니다.',
      );
    await this.awsService.deleteImageFromS3({
      url: sticker.image_url,
    });
    await this.stickersRepository.remove(sticker);
    return;
  }
}
