import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindUserByKakaoId,
} from './interfaces/users.service.interface';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
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
      select: {
        kakaoId: true,
        isAdmin: true,
        username: true,
        description: true,
        profile_image: true,
        date_created: true,
        date_deleted: true,
      },
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
}
