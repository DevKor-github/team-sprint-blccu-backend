import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighbor } from './entities/neighbor.entity';
import { DataSource, Repository } from 'typeorm';
import { FromUserResponseDto } from './dto/from-user-response.dto';
import { ToUserResponseDto } from './dto/to-user-response.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { USER_SELECT_OPTION } from '../users/dto/user-response.dto';

@Injectable()
export class NeighborsService {
  constructor(
    @InjectRepository(Neighbor)
    private readonly neighborsRepository: Repository<Neighbor>,
    private readonly dataSource: DataSource,
  ) {}

  isSame({ from_user, to_user }): boolean {
    if (from_user == to_user) {
      return true;
    }
    return false;
  }
  async isExist({ from_user, to_user }): Promise<boolean> {
    console.log(from_user, to_user);
    const neighbor = await this.neighborsRepository.findOne({
      where: {
        from_user: { kakaoId: from_user },
        to_user: { kakaoId: to_user },
      },
      loadRelationIds: true,
    });
    if (!neighbor) {
      return false;
    }
    return true;
  }
  async followUser({ from_user, to_user }): Promise<FollowUserDto> {
    const isExist = await this.isExist({ from_user, to_user });
    if (isExist) {
      throw new ConflictException('already exists');
    }
    if (this.isSame({ from_user, to_user })) {
      throw new ConflictException('you cannot follow yourself!');
    }
    const neighbor = await this.neighborsRepository.save({
      from_user,
      to_user,
    });
    return neighbor;
  }

  async unfollowUser({ from_user, to_user }) {
    const isExist = await this.isExist({ from_user, to_user });
    if (!isExist) {
      throw new ConflictException('no data exists');
    }
    if (this.isSame({ from_user, to_user })) {
      throw new ConflictException('you cannot unfollow yourself!');
    }
    return this.neighborsRepository.delete({ from_user, to_user });
  }

  async getFollows({ kakaoId }): Promise<ToUserResponseDto[]> {
    const follows = await this.neighborsRepository.find({
      select: {
        from_user: USER_SELECT_OPTION,
        to_user: USER_SELECT_OPTION,
      },
      where: {
        from_user: { kakaoId: kakaoId },
      },
      relations: {
        to_user: true,
      },
    });
    return follows;
  }

  async getFollowers({ kakaoId }): Promise<FromUserResponseDto[]> {
    const follows = await this.neighborsRepository.find({
      select: {
        from_user: USER_SELECT_OPTION,
      },
      where: {
        to_user: { kakaoId: kakaoId },
      },
      relations: {
        from_user: true,
      },
    });
    return follows;
  }
}
