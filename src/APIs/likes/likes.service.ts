import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LikesRepository } from './likes.repository';
import { ILikesServiceIds } from './interfaces/likes.service.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { NotType } from 'src/common/enums/not-type.enum';
import { LikesGetResponseDto } from './dtos/response/likes-get-response.dto';
import { Article } from '../articles/entities/article.entity';
import { Like } from './entities/like.entity';
import { UserFollowingResponseDto } from '../users/dtos/response/user-following-response.dto';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) {}

  async checkIfLiked({
    userId,
    articleId,
  }: ILikesServiceIds): Promise<boolean> {
    const alreadyLiked = await this.likesRepository.findOne({
      where: { article: { id: articleId }, user: { id: userId } },
    });
    if (alreadyLiked) return true;
    return false;
  }

  @MergeExceptionMetadata([
    { service: NotificationsService, methodName: 'emitAlarm' },
  ])
  @ExceptionMetadata([EXCEPTIONS.ALREADY_EXISTS])
  async like({
    articleId,
    userId,
  }: ILikesServiceIds): Promise<LikesGetResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const articleData = await queryRunner.manager.findOne(Article, {
        where: { id: articleId },
      });
      const alreadyLiked = await this.likesRepository.findOne({
        where: { articleId, userId },
      });
      if (alreadyLiked) {
        throw new BlccuException('ALREADY_EXISTS');
      } else {
        const likeData = await queryRunner.manager.save(Like, {
          userId,
          articleId,
        });
        await queryRunner.manager.update(Article, articleData.id, {
          likeCount: () => 'like_count +1',
        });
        await await queryRunner.commitTransaction();
        if (userId != articleData.userId) {
          await this.notificationsService.emitAlarm({
            userId,
            targetUserId: articleData.userId,
            type: NotType.LIKE,
            articleId: articleData.id,
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

  @ExceptionMetadata([EXCEPTIONS.LIKE_NOT_FOUND])
  async cancleLike({ articleId, userId }: ILikesServiceIds): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const articleData = await queryRunner.manager.findOne(Article, {
        where: { id: articleId },
      });
      const alreadyLiked = await this.likesRepository.findOne({
        where: { articleId, userId },
      });
      if (!alreadyLiked) {
        throw new BlccuException('LIKE_NOT_FOUND');
      } else {
        await queryRunner.manager.delete(Like, {
          id: alreadyLiked.id,
        });
        await queryRunner.manager.update(Article, articleData.id, {
          likeCount: () => 'like_count -1',
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

  async findLikes({
    articleId,
    userId,
  }: ILikesServiceIds): Promise<UserFollowingResponseDto[]> {
    return await this.likesRepository.getLikes({ articleId, userId });
  }
}
