import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Likes } from './entities/like.entity';
import { Posts } from '../posts/entities/posts.entity';
import {
  FetchLikeDto,
  ToggleLikeResponseDto,
} from './dtos/toggle-like-response.dto';
import { FetchLikesDto } from './dtos/fetch-likes.dto';
import { USER_SELECT_OPTION } from '../users/dtos/user-response.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
    private readonly dataSource: DataSource,
  ) {}

  async fetchIfLiked({ kakaoId, id }): Promise<boolean> {
    const alreadyLiked = await this.likesRepository.findOne({
      where: { posts: { id }, user: { kakaoId } },
    });
    if (alreadyLiked) return true;
    return false;
  }

  async like({ id, kakaoId }): Promise<FetchLikeDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const postData = await queryRunner.manager.findOne(Posts, {
        where: { id },
      });
      const alreadyLiked = await this.likesRepository.findOne({
        where: { posts: { id }, user: { kakaoId } },
      });
      if (alreadyLiked) {
        throw new ConflictException('이미 좋아요 한 게시글입니다.');
      } else {
        const likeData = await queryRunner.manager.save(Likes, {
          user: kakaoId,
          posts: postData,
        });
        await queryRunner.manager.update(Posts, postData.id, {
          like_count: () => 'like_count +1',
        });
        await queryRunner.commitTransaction();
        return likeData;
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel_like({ id, kakaoId }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const postData = await queryRunner.manager.findOne(Posts, {
        where: { id },
      });
      const alreadyLiked = await this.likesRepository.findOne({
        where: { posts: { id }, user: { kakaoId } },
      });
      if (!alreadyLiked) {
        throw new ConflictException('좋아요 내역을 찾을 수 없습니다.');
      } else {
        const likeData = await queryRunner.manager.delete(Likes, {
          id: alreadyLiked.id,
        });
        await queryRunner.manager.update(Posts, postData.id, {
          like_count: () => 'like_count -1',
        });
        await queryRunner.commitTransaction();
        return likeData;
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async toggleLike({ id, kakaoId }): Promise<ToggleLikeResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const postData = await queryRunner.manager.findOne(Posts, {
        where: { id },
      });
      if (!postData) throw new NotFoundException('게시글이 존재하지 않습니다.');
      // 좋아요 눌렀는지 확인하기
      const alreadyLiked = await this.likesRepository.findOne({
        where: { posts: { id }, user: { kakaoId } },
      });
      if (alreadyLiked) {
        await queryRunner.manager.delete(Likes, { id: alreadyLiked.id });
        await queryRunner.manager.update(Posts, postData.id, {
          like_count: () => 'like_count -1',
        });
        postData.like_count -= 1;
      } else {
        await queryRunner.manager.save(Likes, {
          user: kakaoId,
          posts: postData,
        });
        await queryRunner.manager.update(Posts, postData.id, {
          like_count: () => 'like_count +1',
        });
        postData.like_count += 1;
      }
      await queryRunner.commitTransaction();
      return postData;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async fetchLikes({ id }: FetchLikesDto): Promise<Likes[]> {
    return await this.likesRepository.find({
      select: { user: USER_SELECT_OPTION, id: true },
      relations: { user: true },
      where: { posts: { id } },
    });
  }
}
