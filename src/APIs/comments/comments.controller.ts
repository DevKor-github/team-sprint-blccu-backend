import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Request } from 'express';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { CommentChildrenDto } from './dtos/common/comment-children.dto';
import { CommentCreateRequestDto } from './dtos/request/comment-create-request.dto';
import { CommentsGetResponseDto } from './dtos/response/comments-get-response.dto';
import { CommentDto } from './dtos/common/comment.dto';
import { CommentPatchRequestDto } from './dtos/request/comment-patch-request.dto';

@ApiTags('게시글 API')
@Controller('articles/:articleId/comments')
export class CommentsController {
  constructor(private readonly svc_comments: CommentsService) {}

  @ApiOperation({
    summary: '댓글을 작성한다.',
    description: '댓글을 작성한다.',
  })
  @ApiOkResponse({ type: CommentChildrenDto })
  @ApiCookieAuth()
  @Post()
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  async createComment(
    @Req() req: Request,
    @Param('articleId') articleId: number,
    @Body() body: CommentCreateRequestDto,
  ): Promise<CommentChildrenDto> {
    const userId = req.user.userId;
    return await this.svc_comments.createComment({
      ...body,
      articleId,
      userId,
    });
  }

  @ApiOperation({
    summary: '특정 게시글에 대한 댓글 조회',
  })
  @ApiOkResponse({ type: [CommentsGetResponseDto] })
  @Get()
  async fetchComments(
    @Param('articleId') articleId: number,
  ): Promise<CommentsGetResponseDto[]> {
    return await this.svc_comments.fetchComments({ articleId });
  }

  @ApiOperation({ summary: '특정 게시글에 대한 댓글 수정' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: CommentDto })
  @UseGuards(AuthGuardV2)
  @Patch(':commentId')
  async patchComment(
    @Req() req: Request,
    @Param('articleId') articleId: number,
    @Param('commentId') commentId: number,
    @Body() dto: CommentPatchRequestDto,
  ): Promise<CommentDto> {
    const userId = req.user.userId;
    return await this.svc_comments.patchComment({
      userId,
      articleId,
      commentId,
      ...dto,
    });
  }

  @ApiOperation({
    summary: '댓글을 삭제한다.',
    description: '댓글을 논리삭제한다. date_deleted 칼럼에 값이 생긴다.',
  })
  @ApiCookieAuth()
  @ApiNoContentResponse({ description: '삭제 성공' })
  @Delete(':commentId')
  @UseGuards(AuthGuardV2)
  @HttpCode(204)
  async deleteComment(
    @Req() req: Request,
    @Param('articleId') articleId: number,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    const userId = req.user.userId;
    return await this.svc_comments.delete({
      articleId,
      commentId,
      userId,
    });
  }
}
