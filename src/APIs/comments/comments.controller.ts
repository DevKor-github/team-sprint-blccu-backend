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
import { CreateCommentInput } from './dtos/create-comment.dto';
import { Request } from 'express';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import {
  ChildrenComment,
  FetchCommentDto,
  FetchCommentsDto,
} from './dtos/fetch-comments.dto';
import { PatchCommentDto } from './dtos/patch-comment.dto';

@ApiTags('게시글 API')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '댓글을 작성한다.',
    description: '댓글을 작성한다.',
  })
  @ApiOkResponse({ type: ChildrenComment })
  @ApiCookieAuth()
  @Post()
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  async insertComment(
    @Req() req: Request,
    @Param('postId') postsId: number,
    @Body() body: CreateCommentInput,
  ): Promise<ChildrenComment> {
    const userKakaoId = req.user.userId;
    return await this.commentsService.insert({ ...body, postsId, userKakaoId });
  }

  @ApiOperation({
    summary: '특정 게시글에 대한 댓글 조회',
  })
  @ApiOkResponse({ type: [FetchCommentsDto] })
  @Get()
  async fetchComments(
    @Param('postId') postsId: number,
  ): Promise<FetchCommentsDto[]> {
    return await this.commentsService.fetchComments({ postsId });
  }

  @ApiOperation({ summary: '특정 게시글에 대한 댓글 수정' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: FetchCommentDto })
  @UseGuards(AuthGuardV2)
  @Patch(':commentId')
  async patchComment(
    @Req() req: Request,
    @Param('postId') postsId: number,
    @Param('commentId') id: number,
    @Body() dto: PatchCommentDto,
  ): Promise<FetchCommentDto> {
    const kakaoId = req.user.userId;
    return await this.commentsService.patchComment({
      kakaoId,
      postsId,
      id,
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
