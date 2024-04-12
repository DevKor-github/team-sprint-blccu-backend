import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindUserByKakaoId,
} from './interfaces/users.service.interface';
import { USER_SELECT_OPTION, UserResponseDto } from './dtos/user-response.dto';
import { ImageUploadResponseDto } from 'src/commons/dto/image-upload-response.dto';
import { AwsService } from 'src/utils/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { UploadImageDto } from './dtos/upload-image.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
  ) {}

  // 배포 때 삭제 !!!!
  async getAll() {
    return this.usersRepository.find();
  }
  // ===========================
  async adminCheck({ kakaoId }) {
    const user = await this.findUserByKakaoId({
      kakaoId,
    });
    if (!user.isAdmin) throw new UnauthorizedException('어드민이 아닙니다.');
  }
  async create({ kakaoId }: IUsersServiceCreate) {
    const result = await this.usersRepository.save({
      kakaoId,
    });
    return result;
  }

  async findUserByKakaoId({
    kakaoId,
  }: IUsersServiceFindUserByKakaoId): Promise<UserResponseDto> {
    const result = await this.usersRepository.findOne({
      select: USER_SELECT_OPTION,
      where: { kakaoId: kakaoId },
    });
    return result;
  }
  async findUserByKakaoIdWithToken({
    kakaoId,
  }: IUsersServiceFindUserByKakaoId) {
    const result = await this.usersRepository.findOne({
      where: { kakaoId: kakaoId },
    });
    return result;
  }

  async setCurrentRefreshToken({ kakaoId, current_refresh_token }) {
    const user = await this.findUserByKakaoId({ kakaoId });
    this.usersRepository.save({
      ...user,
      current_refresh_token,
    });
  }

  async patchUser({
    kakaoId,
    description,
    username,
  }): Promise<UserResponseDto> {
    const user = await this.findUserByKakaoId({ kakaoId });
    if (description) {
      user.description = description;
    }
    if (username) {
      user.username = username;
    }
    return await this.usersRepository.save(user);
  }

  async findUsersByName({ username }): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find({
      select: USER_SELECT_OPTION,
      where: {
        username: ILike(`%${username}%`),
      },
    });
    return users;
  }

  async uploadProfileImage({
    userKakaoId,
    file,
  }: UploadImageDto): Promise<ImageUploadResponseDto> {
    const user = await this.findUserByKakaoIdWithToken({
      kakaoId: userKakaoId,
    });
    const { image_url } = await this.saveImage(file);
    await this.usersRepository.save({ ...user, profile_image: image_url });
    return { image_url };
  }
  async saveImage(file: Express.Multer.File): Promise<ImageUploadResponseDto> {
    return await this.imageUpload(file);
  }

  async uploadBackgroundImage({
    userKakaoId,
    file,
  }: UploadImageDto): Promise<ImageUploadResponseDto> {
    const user = await this.findUserByKakaoIdWithToken({
      kakaoId: userKakaoId,
    });
    const { image_url } = await this.saveImage(file);
    await this.usersRepository.save({ ...user, background_image: image_url });
    return { image_url };
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
}
