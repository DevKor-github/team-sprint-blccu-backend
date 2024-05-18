import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FromUserResponseDto } from './dtos/from-user-response.dto';
import { ToUserResponseDto } from './dtos/to-user-response.dto';
import { FollowUserDto } from './dtos/follow-user.dto';
import { USER_SELECT_OPTION } from '../users/dtos/user-response.dto';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    private readonly dataSource: DataSource,
  ) {}

  isSame({ from_user, to_user }): boolean {
    if (from_user == to_user) {
      return true;
    }
    return false;
  }

  async getScope({ from_user, to_user }) {
    if (from_user === to_user)
      return [OpenScope.PUBLIC, OpenScope.PROTECTED, OpenScope.PRIVATE];
    if (from_user !== null && to_user !== null) {
      const follow = await this.followsRepository.findOne({
        where: { from_user, to_user },
      });
      if (follow) {
        return [OpenScope.PUBLIC, OpenScope.PROTECTED];
      }
    }

    return [OpenScope.PUBLIC];
  }

  async isExist({ from_user, to_user }): Promise<boolean> {
    console.log(from_user, to_user);
    const follow = await this.followsRepository.findOne({
      where: {
        from_user: { kakaoId: from_user },
        to_user: { kakaoId: to_user },
      },
      loadRelationIds: true,
    });
    if (!follow) {
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
    const follow = await this.followsRepository.save({
      from_user,
      to_user,
    });
    return follow;
  }

  async unfollowUser({ from_user, to_user }) {
    const isExist = await this.isExist({ from_user, to_user });
    if (!isExist) {
      throw new ConflictException('no data exists');
    }
    if (this.isSame({ from_user, to_user })) {
      throw new ConflictException('you cannot unfollow yourself!');
    }
    return this.followsRepository.delete({ from_user, to_user });
  }

  async getFollows({ kakaoId }): Promise<ToUserResponseDto[]> {
    const follows = await this.followsRepository.find({
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
    const follows = await this.followsRepository.find({
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
