import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Posts } from '../posts/entities/posts.entity';
import { ToggleLikeResponseDto } from './dto/toggle-like-response.dto';
import { FetchLikesDto } from './dto/fetch-likes.dto';
import { USER_SELECT_OPTION } from '../users/dto/user-response.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly dataSource: DataSource,
  ) {}

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
        where: { post: { id }, user: { kakaoId } },
      });

      if (alreadyLiked) {
        await queryRunner.manager.delete(Like, { id: alreadyLiked.id });

        // 좋아요 카운트 락걸고 쿼리!!!
        const result = await queryRunner.manager.save(Posts, {
          lock: { mode: 'pessimistic_write' },
          ...postData,
          like_count: postData.like_count - 1,
        });
        await queryRunner.commitTransaction();
        return result;
      }
      await queryRunner.manager.save(Like, { user: kakaoId, post: postData });
      const result = await queryRunner.manager.save(Posts, {
        lock: { mode: 'pessimistic_write' },
        ...postData,
        like_count: postData.like_count + 1,
      });
      await queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async fetchLikes({ id }: FetchLikesDto): Promise<Like[]> {
    return await this.likesRepository.find({
      select: { user: USER_SELECT_OPTION, id: true },
      relations: { user: true },
      where: { post: { id } },
    });
  }
}
