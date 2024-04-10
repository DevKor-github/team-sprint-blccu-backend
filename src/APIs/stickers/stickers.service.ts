import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sticker } from './entities/sticker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStickerDto } from './dtos/create-sticker.dto';
import { AwsService } from 'src/utils/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { ImageUploadResponseDto } from 'src/commons/dto/image-upload-response.dto';
import { UsersService } from '../users/users.service';
import { removeBackground } from '@imgly/background-removal-node';

@Injectable()
export class StickersService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    @InjectRepository(Sticker)
    private readonly stickersRepository: Repository<Sticker>,
    private readonly usersService: UsersService,
  ) {}

  async findStickerById({ id }) {
    return await this.stickersRepository.findOne({ where: { id } });
  }

  async existCheck({ id }) {
    const data = await this.findStickerById({ id });
    if (!data) throw new NotFoundException('스티커를 찾을 수 없습니다.');
  }
  async saveImage(file: Express.Multer.File): Promise<ImageUploadResponseDto> {
    return await this.imageUpload(file);
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
    );
    return { image_url };
  }
  async createPrivateSticker({
    userKakaoId,
    file,
  }: CreateStickerDto): Promise<Sticker> {
    const { image_url } = await this.saveImage(file);
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
    const { image_url } = await this.saveImage(file);
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

  async toggleReusable({ userKakaoId, id }) {
    const sticker = await this.stickersRepository.findOne({ where: { id } });
    if (!sticker) throw new NotFoundException('스티커가 존재하지 않습니다.');
    if (sticker.userKakaoId != userKakaoId)
      throw new UnauthorizedException('스티커 제작자가 아닙니다.');
    return await this.stickersRepository.update(id, {
      isReusable: () => '!isReusable',
    });
  }
  async fetchUserStickers({ userKakaoId }): Promise<Sticker[]> {
    return await this.stickersRepository.find({
      where: { userKakaoId, isReusable: true, isDefault: false },
    });
  }

  async fetchPublicStickers() {
    return await this.stickersRepository.find({
      where: { isDefault: true },
    });
  }

  async removeBg({ url }) {
    return await removeBackground(url);
  }
}
