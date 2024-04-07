import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dtos/create-comment.dto';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteCommentDto } from './dtos/delete-comment.dto';

@ApiTags('댓글 API')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '댓글을 작성하거나 수정한다.',
    description: '댓글을 작성하거나 (optional)id에 해당하는 댓글을 수정한다.',
  })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async upsertComment(@Req() req: Request, @Body() body: CreateCommentInput) {
    const userKakaoId = req.user.userId;
    return await this.commentsService.upsert({ ...body, userKakaoId });
  }

  @ApiOperation({
    summary: '댓글을 삭제한다.',
    description: '댓글을 논리삭제한다. date_deleted 칼럼에 값이 생긴다.',
  })
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(@Req() req: Request, @Body() body: DeleteCommentDto) {
    const userKakaoId = req.user.userId;
    return await this.commentsService.delete({ ...body, userKakaoId });
  }
}
