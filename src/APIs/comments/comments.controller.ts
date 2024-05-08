import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dtos/create-comment.dto';
import { Request } from 'express';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/commons/guards/auth.guard';
import { ChildrenComment } from './dtos/fetch-comments.dto';

@ApiTags('게시글 API')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '댓글을 작성하거나 수정한다.',
    description: '댓글을 작성하거나 (optional)id에 해당하는 댓글을 수정한다.',
  })
  @ApiOkResponse({ type: ChildrenComment })
  @ApiCookieAuth()
  @Post()
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  async upsertComment(
    @Req() req: Request,
    @Param('postId') postsId: number,
    @Body() body: CreateCommentInput,
  ): Promise<ChildrenComment> {
    const userKakaoId = req.user.userId;
    return await this.commentsService.upsert({ ...body, postsId, userKakaoId });
  }

  @ApiOperation({
    summary: '댓글을 삭제한다.',
    description: '댓글을 논리삭제한다. date_deleted 칼럼에 값이 생긴다.',
  })
  @ApiCookieAuth()
  @ApiNoContentResponse({ description: '삭제 성공' })
  @Delete()
  @UseGuards(AuthGuardV2)
  @HttpCode(204)
  async deleteComment(
    @Req() req: Request,
    @Param('postId') postsId: number,
    @Param('commentId') id: number,
  ): Promise<void> {
    const userKakaoId = req.user.userId;
    return await this.commentsService.delete({
      postsId,
      id,
      userKakaoId,
    });
  }
}
