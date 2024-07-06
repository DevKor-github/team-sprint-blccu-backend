import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { UserDto } from '../dtos/common/user.dto';

@Injectable()
export class UsersValidateService {
  constructor(private readonly repo_users: UsersRepository) {}
  async adminCheck({ userId }): Promise<UserDto> {
    const user = await this.repo_users.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('존재하지 않는 유저 입니다.');
    if (!user.isAdmin) throw new UnauthorizedException('어드민이 아닙니다.');
    return user;
  }

  async existCheck({ userId }): Promise<UserDto> {
    const user = await this.repo_users.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('존재하지 않는 유저 입니다.');
    return user;
  }
}
