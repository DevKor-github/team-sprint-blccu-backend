import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Likes } from './entities/like.entity';
import { Posts } from '../articles/entities/article.entity';
import { FetchLikeResponseDto } from './dtos/fetch-likes.dto';
import { LikesRepository } from './likes.repository';
import { UserResponseDtoWithFollowing } from '../users/dtos/user-response.dto';
import { ILikesServiceIds } from './interfaces/likes.service.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { NotType } from 'src/common/enums/not-type.enum';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) {}

  async fetchIfLiked({ kakaoId, id }: ILikesServiceIds): Promise<boolean> {
    const alreadyLiked = await this.likesRepository.findOne({
      where: { posts: { id }, user: { kakaoId } },
    });
    if (alreadyLiked) return true;
    return false;
  }

  async like({ id, kakaoId }: ILikesServiceIds): Promise<FetchLikeResponseDto> {
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
          userKakaoId: kakaoId,
          posts: postData,
        });
        await queryRunner.manager.update(Posts, postData.id, {
          like_count: () => 'like_count +1',
        });
        await await queryRunner.commitTransaction();
        if (kakaoId != postData.userKakaoId) {
          await this.notificationsService.emitAlarm({
            userKakaoId: kakaoId,
            targetUserKakaoId: postData.userKakaoId,
            type: NotType.LIKE,
            postId: postData.id,
          });
        }
        return likeData;
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel_like({ id, kakaoId }: ILikesServiceIds): Promise<void> {
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
        await queryRunner.manager.delete(Likes, {
          id: alreadyLiked.id,
        });
        await queryRunner.manager.update(Posts, postData.id, {
          like_count: () => 'like_count -1',
        });
        await queryRunner.commitTransaction();
        return;
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async fetchLikes({
    id,
    kakaoId,
  }: ILikesServiceIds): Promise<UserResponseDtoWithFollowing[]> {
    return await this.likesRepository.getLikes({ id, kakaoId });
  }
}
