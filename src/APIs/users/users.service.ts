import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IUsersServiceCreate,
  IUsersServiceDelete,
  IUsersServiceFindUserByHandle,
  IUsersServiceFindUserByKakaoId,
  IUsersServiceImageUpload,
} from './interfaces/users.service.interface';
import {
  USER_SELECT_OPTION,
  UserResponseDto,
  UserResponseDtoWithFollowing,
} from './dtos/user-response.dto';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { UtilsService } from 'src/utils/utils.service';
import { UploadImageDto } from './dtos/upload-image.dto';
import { UsersRepository } from './users.repository';
import { DataSource, UpdateResult } from 'typeorm';
import { Posts } from '../posts/entities/posts.entity';
import { Follow } from '../follows/entities/follow.entity';
import { User } from './entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { AwsService } from 'src/modules/aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
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

  async existCheck({ kakaoId }) {
    const user = await this.findUserByKakaoId({
      kakaoId,
    });
    if (!user) throw new BadRequestException('존재하지 않는 유저 입니다.');
  }

  async create({ kakaoId }: IUsersServiceCreate) {
    const userTempName = 'USER' + this.utilsService.getUUID().substring(0, 8);
    const result = await this.usersRepository.save({
      kakaoId,
      username: userTempName,
      handle: userTempName,
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

  async findUserByKakaoIdWithDelete({
    kakaoId,
  }: IUsersServiceFindUserByKakaoId): Promise<UserResponseDto> {
    const result = await this.usersRepository.findOne({
      select: USER_SELECT_OPTION,
      where: { kakaoId: kakaoId },
      withDeleted: true, // 소프트 삭제된 사용자도 포함
    });
    return result;
  }

  async activateUser({ kakaoId }): Promise<UpdateResult> {
    return await this.usersRepository.update(
      { kakaoId: kakaoId },
      { date_deleted: null },
    );
  }

  async findUserByHandle({
    handle,
  }: IUsersServiceFindUserByHandle): Promise<UserResponseDto> {
    const result = await this.usersRepository.findOne({
      select: USER_SELECT_OPTION,
      where: { handle },
    });
    if (!result) throw new NotFoundException('유저를 찾을 수 없습니다.');
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
    return await this.usersRepository.save({
      ...user,
      current_refresh_token,
    });
  }

  async patchUser({
    kakaoId,
    handle,
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
    if (handle) user.handle = handle;
    try {
      const data = await this.usersRepository.save(user);
      return data;
    } catch (e) {
      throw new ConflictException(
        'username || handle 값이 Unique하지 않습니다.',
      );
    }
  }

  async findUsersByName({
    kakaoId,
    username,
  }): Promise<UserResponseDtoWithFollowing[]> {
    const users = await this.usersRepository.fetchUsersWithNameAndFollowing({
      kakaoId,
      username,
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
    const { image_url } = await this.imageUpload({ file, resize: 800 });
    await this.usersRepository.save({ ...user, profile_image: image_url });
    await this.awsService.deleteImageFromS3({ url: user.profile_image });
    return { image_url };
  }

  async uploadBackgroundImage({
    userKakaoId,
    file,
  }: UploadImageDto): Promise<ImageUploadResponseDto> {
    const user = await this.findUserByKakaoIdWithToken({
      kakaoId: userKakaoId,
    });
    const { image_url } = await this.imageUpload({ file, resize: 1600 });
    await this.usersRepository.save({ ...user, background_image: image_url });
    await this.awsService.deleteImageFromS3({ url: user.background_image });
    return { image_url };
  }

  async imageUpload({
    file,
    resize,
  }: IUsersServiceImageUpload): Promise<ImageUploadResponseDto> {
    const imageName = this.utilsService.getUUID();
    const ext = 'jpg';
    const image_url = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
      resize,
    );
    return { image_url };
  }

  async delete({ kakaoId, type, content }: IUsersServiceDelete): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 피드백 생성
      await queryRunner.manager.save(Feedback, {
        type,
        content,
        userKakaoId: kakaoId,
      });
      const commentsToDelete = await queryRunner.manager.find(Comment, {
        where: { userKakaoId: kakaoId },
      });
      for (const data of commentsToDelete) {
        let childrenData = [];
        if (data.parentId == null)
          childrenData = await queryRunner.manager.find(Comment, {
            where: { parentId: data.id },
          });
        if (childrenData.length == 0) {
          await queryRunner.manager.delete(Comment, {
            id: data.id,
            user: { kakaoId },
          });
          await queryRunner.manager.update(Posts, data.postsId, {
            comment_count: () => 'comment_count - 1',
          });
        } else {
          await queryRunner.manager.softDelete(Comment, {
            user: { kakaoId },
            id: data.id,
          });
        }
      }
      await queryRunner.manager.softDelete(Posts, { userKakaoId: kakaoId });
      // 연동된 댓글 soft delete
      await queryRunner.manager.softDelete(Comment, { userKakaoId: kakaoId });
      // 팔로우 일괄 취소
      const followingsToDelete = await queryRunner.manager.find(Follow, {
        where: { fromUserKakaoId: kakaoId },
      });
      await queryRunner.manager.delete(Follow, { fromUserKakaoId: kakaoId });
      await queryRunner.manager.update(
        User,
        { kakaoId },
        {
          following_count: 0,
          follower_count: 0,
        },
      );
      for (const following of followingsToDelete) {
        await queryRunner.manager.decrement(
          User,
          { kakaoId: following.toUserKakaoId },
          'follower_count',
          1,
        );
      }
      // 팔로잉 일괄 취소
      const followersToDelete = await queryRunner.manager.find(Follow, {
        where: { toUserKakaoId: kakaoId },
      });
      await queryRunner.manager.delete(Follow, { toUserKakaoId: kakaoId });
      for (const following of followersToDelete) {
        await queryRunner.manager.decrement(
          User,
          { kakaoId: following.fromUserKakaoId },
          'following_count',
          1,
        );
      }
      await queryRunner.manager.softDelete(User, { kakaoId });
      await queryRunner.commitTransaction();
      return;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
