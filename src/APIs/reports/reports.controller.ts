import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReportInput } from './dtos/create-report.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { FetchReportResponse } from './dtos/fetch-report.dto';
import { ReportTarget } from 'src/common/enums/report-target.enum';

@Controller('')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiTags('게시글 API')
  @ApiOperation({
    summary: '게시물 신고',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: FetchReportResponse })
  @UseGuards(AuthGuardV2)
  @Post('posts/:postId/report')
  @HttpCode(201)
  async reportPost(
    @Req() req: Request,
    @Body() body: CreateReportInput,
    @Param('postId') targetId: number,
  ): Promise<FetchReportResponse> {
    const userKakaoId = req.user.userId;
    return await this.reportsService.create({
      targetId,
      target: ReportTarget.POSTS,
      userKakaoId,
      ...body,
    });
  }

  @ApiTags('게시글 API')
  @ApiOperation({
    summary: '댓글 신고',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: FetchReportResponse })
  @UseGuards(AuthGuardV2)
  @Post('posts/comments/:commentId/report')
  @HttpCode(201)
  async reportComment(
    @Req() req: Request,
    @Body() body: CreateReportInput,
    @Param('commentId') targetId: number,
  ): Promise<FetchReportResponse> {
    const userKakaoId = req.user.userId;
    return await this.reportsService.create({
      targetId,
      target: ReportTarget.COMMENTS,
      userKakaoId,
      ...body,
    });
  }

  @ApiTags('어드민 API')
  @ApiTags('유저 API')
  @ApiOperation({
    summary: '[어드민용] 신고 내역 조회',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [FetchReportResponse] })
  @UseGuards(AuthGuardV2)
  @Get('users/admin/reports')
  async fetchAll(@Req() req: Request): Promise<FetchReportResponse[]> {
    const kakaoId = req.user.userId;
    return await this.reportsService.fetchAll({ kakaoId });
  }
}
