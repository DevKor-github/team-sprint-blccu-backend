import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighbor } from './entities/neighbor.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NeighborsService {
  constructor(
    @InjectRepository(Neighbor)
    private readonly neighborsRepository: Repository<Neighbor>,
    private readonly dataSource: DataSource,
  ) {}

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
  async followUser({ from_user, to_user }) {
    const isExist = await this.isExist({ from_user, to_user });
    if (isExist) {
      throw new ConflictException('already exists');
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
    return this.neighborsRepository.delete({ from_user, to_user });
  }

  async getFollows({ kakaoId }) {
    const follows = await this.neighborsRepository.find({
      select: {
        from_user: {
          kakaoId: true,
          isAdmin: true,
          username: true,
          description: true,
          profile_image: true,
          date_created: true,
          date_deleted: true,
        },
        to_user: {
          kakaoId: true,
          isAdmin: true,
          username: true,
          description: true,
          profile_image: true,
          date_created: true,
          date_deleted: true,
        },
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

  async getFollowers({ kakaoId }) {
    const follows = await this.neighborsRepository.find({
      select: {
        from_user: { current_refresh_token: false },
        to_user: { current_refresh_token: false },
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
