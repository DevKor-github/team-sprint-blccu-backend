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
import { ChildrenComment, FetchCommentsDto } from './dtos/fetch-comments.dto';
import { USER_PRIMARY_SELECT_OPTION } from '../users/dtos/user-response.dto';

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
        '게시글 아이디가 루트 댓글이 작성된 게시글 아이디와 일치하지 않습니다.',
      );
    if (parent.parentId)
      throw new BadRequestException('부모 댓글이 루트 댓글이 아닙니다.');
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
  async upsert(createCommentDto: CreateCommentDto): Promise<ChildrenComment> {
    if (createCommentDto.parentId)
      await this.postsIdValidCheck({
        parentId: createCommentDto.parentId,
        postsId: createCommentDto.postsId,
      });
    if (createCommentDto.id) {
      await this.existCheck({ id: createCommentDto.id });
    } else {
      // id를 입력하지 않았을 경우(생성의 경우)에만 count 증가
      await this.dataSource.manager.update(Posts, createCommentDto.postsId, {
        comment_count: () => 'comment_count +1',
      });
    }
    const upsertData = await this.commentsRepository.upsertComment({
      createCommentDto,
    });
    const id = upsertData.identifiers[0];
    console.log(id);
    return await this.commentsRepository.findOne({
      select: {
        user: USER_PRIMARY_SELECT_OPTION,
      },
      relations: { user: true },
      where: { ...id },
    });
  }

  async fetchComments({ postsId }): Promise<FetchCommentsDto[]> {
    return await this.commentsRepository.fetchComments({ postsId });
  }

  async delete({ id, userKakaoId }): Promise<void> {
    try {
      const data = await this.existCheck({ id });
      await this.commentsRepository.softDelete({
        user: { kakaoId: userKakaoId },
        id,
      });
      await this.dataSource.manager.update(Posts, data.postsId, {
        comment_count: () => 'comment_count -1',
      });
    } catch (e) {
      throw e;
    }
  }
}
