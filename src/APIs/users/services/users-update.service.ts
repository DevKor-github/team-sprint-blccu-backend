import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../users.repository';
import { UsersValidateService } from './users-validate-service';
import { UserDto } from '../dtos/common/user.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { IUsersServiceImageUpload } from '../interfaces/users.service.interface';
import { ImagesService } from 'src/modules/images/images.service';
import { MergeExceptionMetadata } from 'src/common/decorators/merge-exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly repo_users: UsersRepository,
    private readonly svc_usersValidate: UsersValidateService,
    private readonly svc_images: ImagesService,
  ) {}

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'existCheck' },
  ])
  async setCurrentRefreshToken({ userId, currentRefreshToken }): Promise<User> {
    const user = await this.svc_usersValidate.existCheck({ userId });
    return await this.repo_users.save({
      ...user,
      currentRefreshToken,
    });
  }

  async activateUser({ userId }): Promise<UpdateResult> {
    return await this.repo_users.update({ id: userId }, { dateDeleted: null });
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'existCheck' },
  ])
  @ExceptionMetadata([EXCEPTIONS.UNIQUE_CONSTRAINT_VIOLATION])
  async updateUser({
    userId,
    handle,
    description,
    username,
  }): Promise<UserDto> {
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
      throw new BlccuException('UNIQUE_CONSTRAINT_VIOLATION');
    }
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'existCheck' },
    { service: ImagesService, methodName: 'imageUpload' },
    { service: ImagesService, methodName: 'deleteImage' },
  ])
  async updateProfileImage({
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
      tag: 'users/images/profiles',
    });
    await this.svc_images.deleteImage({ url: user.profileImage });

    await this.repo_users.save({ ...user, profileImage: imageUrl });
    return { imageUrl };
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'existCheck' },
    { service: ImagesService, methodName: 'imageUpload' },
    { service: ImagesService, methodName: 'deleteImage' },
  ])
  async updateBackgroundImage({
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
      tag: 'users/images/backgrounds',
    });
    await this.svc_images.deleteImage({ url: user.backgroundImage });

    await this.repo_users.save({ ...user, backgroundImage: imageUrl });
    return { imageUrl };
  }
}
