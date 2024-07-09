import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { USER_SELECT_OPTION, UserDto } from '../dtos/common/user.dto';
import { User } from '../entities/user.entity';
import { UserFollowingResponseDto } from '../dtos/response/user-following-response.dto';
import {
  IUsersServiceFindUserByHandle,
  IUsersServiceFindUserById,
} from '../interfaces/users.service.interface';

@Injectable()
export class UsersReadService {
  constructor(private readonly repo_users: UsersRepository) {}

  async findUserById({ userId }: IUsersServiceFindUserById): Promise<UserDto> {
    const result = await this.repo_users.findOne({
      select: USER_SELECT_OPTION,
      where: { id: userId },
    });
    return result;
  }

  async findUserByIdWithDelete({
    userId,
  }: IUsersServiceFindUserById): Promise<UserDto> {
    const result = await this.repo_users.findOne({
      select: USER_SELECT_OPTION,
      where: { id: userId },
      withDeleted: true, // 소프트 삭제된 사용자도 포함
    });
    return result;
  }

  async findUserByHandle({
    handle,
  }: IUsersServiceFindUserByHandle): Promise<UserDto> {
    const result = await this.repo_users.findOne({
      select: USER_SELECT_OPTION,
      where: { handle },
    });
    return result;
  }

  async findUserByIdWithToken({
    userId,
  }: IUsersServiceFindUserById): Promise<User> {
    const result = await this.repo_users.findOne({
      where: { id: userId },
    });
    return result;
  }

  async findUsersByName({
    userId,
    username,
  }): Promise<UserFollowingResponseDto[]> {
    const users = await this.repo_users.readWithNameAndFollowing({
      userId,
      username,
    });
    return users;
  }
}
