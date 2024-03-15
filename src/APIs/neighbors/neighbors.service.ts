import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighbor } from './entities/neighbor.entity';
import { DataSource, Repository } from 'typeorm';
// import { User } from '../users/entities/user.entity';

@Injectable()
export class NeighborsService {
  constructor(
    @InjectRepository(Neighbor)
    private readonly neighborsRepository: Repository<Neighbor>,
    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,
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
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   const neighbor = await this.neighborsRepository.save({
    //     from_user,
    //     to_user,
    //   });
    //   return neighbor;
    // } catch (e) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
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
      where: {
        to_user: { kakaoId: kakaoId },
      },
      relations: {
        from_user: true,
      },
    });
    return follows;
  }
  // getFollower() {} 유저 서비스에서 하자

  // getFollowee() {}
}
