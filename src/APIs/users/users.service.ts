import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindUserByKakaoId,
} from './interfaces/users.service.interface';
import { USER_SELECT_OPTION, UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 배포 때 삭제 !!!!
  async getAll() {
    return this.usersRepository.find();
  }
  // ===========================

  async create({ kakaoId, username, profile_image }: IUsersServiceCreate) {
    const result = await this.usersRepository.save({
      kakaoId: kakaoId,
      username,
      profile_image,
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
    console.log(result);
    return result;
  }
  async findUserByKakaoIdWithToken({
    kakaoId,
  }: IUsersServiceFindUserByKakaoId) {
    const result = await this.usersRepository.findOne({
      where: { kakaoId: kakaoId },
    });
    console.log(result);
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
}
