import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sticker } from './entities/sticker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { ImageUploadResponseDto } from 'src/commons/dto/image-upload-response.dto';

@Injectable()
export class StickersService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    @InjectRepository(Sticker)
    private readonly stickersRepository: Repository<Sticker>,
  ) {}
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
}
