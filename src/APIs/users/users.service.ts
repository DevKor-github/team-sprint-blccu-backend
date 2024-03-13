import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindUser,
  IUsersServiceFindUserByKakaoId,
} from './interfaces/users.service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create({ kakaoId, username, profile_image }: IUsersServiceCreate) {
    const result = await this.usersRepository.create({
      kakaoId: kakaoId,
      username,
      profile_image,
    });
    return result;
  }
  findUser({ id }: IUsersServiceFindUser) {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findUserByKakaoId({ kakaoId }: IUsersServiceFindUserByKakaoId) {
    const result = await this.usersRepository.findOne({
      where: { kakaoId: kakaoId },
    });
    console.log(result);
    return result;
  }
}
