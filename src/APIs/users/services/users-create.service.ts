import { Injectable } from '@nestjs/common';
import { getUUID } from 'src/utils/uuidUtils';
import { IUsersServiceCreate } from '../interfaces/users.service.interface';
import { UsersRepository } from '../users.repository';

@Injectable()
export class UsersCreateService {
  constructor(private readonly repo_users: UsersRepository) {}

  async createUser({ userId }: IUsersServiceCreate) {
    const userTempName = 'USER' + getUUID().substring(0, 8);
    const result = await this.repo_users.save({
      id: userId,
      username: userTempName,
      handle: userTempName,
    });
    return result;
  }
}
