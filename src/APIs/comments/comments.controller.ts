import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { CommentChildrenDto } from './dtos/common/comment-children.dto';
import { CommentCreateRequestDto } from './dtos/request/comment-create-request.dto';
import { CommentsGetResponseDto } from './dtos/response/comments-get-response.dto';
import { CommentDto } from './dtos/common/comment.dto';
import { CommentPatchRequestDto } from './dtos/request/comment-patch-request.dto';
import { CommentsDocs } from './docs/comments-docs.decorator';

@CommentsDocs
@Controller()
export class CommentsController {
  constructor(private readonly svc_comments: CommentsService) {}

  @Post('articles/:articleId/comments')
  @UseGuards(AuthGuardV2)
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

  @Get('articles/:articleId/comments')
  async fetchComments(
    @Param('articleId') articleId: number,
  ): Promise<CommentsGetResponseDto[]> {
    return await this.svc_comments.fetchComments({ articleId });
  }

  @UseGuards(AuthGuardV2)
  @Get('users/me/comments')
  async fetchUserComments(@Req() req: Request): Promise<CommentDto[]> {
    const userId = req.user.userId;
    return await this.svc_comments.fetchUserComments({ userId });
  }

  @UseGuards(AuthGuardV2)
  @Patch('articles/:articleId/comments/:commentId')
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

  @Delete('articles/:articleId/comments/:commentId')
  @UseGuards(AuthGuardV2)
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
