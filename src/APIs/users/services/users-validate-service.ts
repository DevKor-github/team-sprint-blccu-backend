import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { UserDto } from '../dtos/common/user.dto';
import { ExceptionMetadata } from 'src/common/decorators/exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';

@Injectable()
export class UsersValidateService {
  constructor(private readonly repo_users: UsersRepository) {}

  @ExceptionMetadata([EXCEPTIONS.USER_NOT_FOUND, EXCEPTIONS.NOT_AN_ADMIN])
  async adminCheck({ userId }): Promise<UserDto> {
    const user = await this.repo_users.findOne({
      where: { id: userId },
    });
    if (!user) throw new BlccuException('USER_NOT_FOUND');
    if (!user.isAdmin) throw new BlccuException('NOT_AN_ADMIN');
    return user;
  }

  @ExceptionMetadata([EXCEPTIONS.USER_NOT_FOUND])
  async existCheck({ userId }): Promise<UserDto> {
    const user = await this.repo_users.findOne({
      where: { id: userId },
    });
    if (!user) throw new BlccuException('USER_NOT_FOUND');
    return user;
  }
}
