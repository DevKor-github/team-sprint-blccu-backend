import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Posts } from '../posts/entities/posts.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly dataSource: DataSource,
  ) {}

  async toggleLike({ id, kakaoId }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const postData = await queryRunner.manager.findOne(Posts, {
        where: { id },
      });
      if (postData) throw new NotFoundException('게시글이 존재하지 않습니다.');

      // 좋아요 눌렀는지 확인하기
      const alreadyLiked = await this.likesRepository.findOne({
        where: { post: { id: 1 }, user: { kakaoId: 1 } },
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
      throw new InternalServerErrorException(e);
    } finally {
      await queryRunner.release();
    }
  }
}
