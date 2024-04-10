import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UsersService } from '../users/users.service';
import { CommentsRepository } from './comments.repository';
import { DataSource } from 'typeorm';
import { Posts } from '../posts/entities/posts.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async postsIdValidCheck({ parentId, postsId }) {
    const parent = await this.existCheck({ id: parentId });
    if (parent.postsId != postsId)
      throw new BadRequestException(
        '루트 댓글이 작성된 게시글 아이디와 일치하지 않습니다.',
      );
  }
  async existCheck({ id }) {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(
        '댓글의 아이디를 찾을 수 없습니다. 존재하지 않거나 이미 삭제되었습니다.',
      );
    }
    return comment;
  }
  async upsert(createCommentDto: CreateCommentDto) {
    if (createCommentDto.id) {
      await this.existCheck({ id: createCommentDto.id });
    }
    if (createCommentDto.parentId)
      await this.postsIdValidCheck({
        parentId: createCommentDto.parentId,
        postsId: createCommentDto.postsId,
      });
    await this.dataSource.manager.update(Posts, createCommentDto.postsId, {
      comment_count: () => 'comment_count +1',
    });
    return await this.commentsRepository.upsertComment({ createCommentDto });
  }

  async fetchComments({ postsId }) {
    return await this.commentsRepository.fetchComments({ postsId });
  }

  async delete({ id, userKakaoId }) {
    const data = await this.existCheck({ id });
    await this.dataSource.manager.update(Posts, data.postsId, {
      comment_count: () => 'comment_count -1',
    });
    await this.commentsRepository.softDelete({
      user: { kakaoId: userKakaoId },
      id,
    });
  }
}
