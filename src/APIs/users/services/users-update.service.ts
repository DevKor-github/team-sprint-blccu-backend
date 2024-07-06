import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../users.repository';
import { UsersValidateService } from './users-validate-service';
import { UserDto } from '../dtos/common/user.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { IUsersServiceImageUpload } from '../interfaces/users.service.interface';
import { ImagesService } from 'src/modules/images/images.service';

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly repo_users: UsersRepository,
    private readonly svc_usersValidate: UsersValidateService,
    private readonly svc_images: ImagesService,
  ) {}

  async activateUser({ userId }): Promise<UpdateResult> {
    return await this.repo_users.update({ id: userId }, { dateDeleted: null });
  }

  async setCurrentRefreshToken({ userId, currentRefreshToken }): Promise<User> {
    const user = await this.repo_users.findOne({ where: { id: userId } });
    return await this.repo_users.save({
      ...user,
      currentRefreshToken,
    });
  }

  async patchUser({ userId, handle, description, username }): Promise<UserDto> {
    const user = await this.svc_usersValidate.existCheck({ userId });
    if (description) {
      user.description = description;
    }
    if (username) {
      user.username = username;
    }
    if (handle) user.handle = handle;
    try {
      const data = await this.repo_users.save(user);
      return data;
    } catch (e) {
      throw new ConflictException(
        'username || handle 값이 Unique하지 않습니다.',
      );
    }
  }

  async uploadProfileImage({
    userId,
    file,
  }: IUsersServiceImageUpload): Promise<ImageUploadResponseDto> {
    const user = await this.svc_usersValidate.existCheck({
      userId,
    });
    const { imageUrl } = await this.svc_images.imageUpload({
      ext: 'jpg',
      file,
      resize: 800,
    });
    await this.svc_images.deleteImage({ url: user.profileImage });

    await this.repo_users.save({ ...user, profileImage: imageUrl });
    return { imageUrl };
  }
  
  async uploadBackgroundImage({
    userId,
    file,
  }: IUsersServiceImageUpload): Promise<ImageUploadResponseDto> {
    const user = await this.svc_usersValidate.existCheck({
      userId,
    });
    const { imageUrl } = await this.svc_images.imageUpload({
      ext: 'jpg',
      file,
      resize: 1600,
    });
    await this.svc_images.deleteImage({ url: user.backgroundImage });

    await this.repo_users.save({ ...user, backgroundImage: imageUrl });
    return { imageUrl };
  }
