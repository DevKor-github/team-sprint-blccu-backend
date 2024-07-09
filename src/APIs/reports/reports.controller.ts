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
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ReportTarget } from 'src/common/enums/report-target.enum';
import { ReportDto } from './dtos/common/report.dto';
import { ReportCreateRequestDto } from './dtos/request/report-create-request.dto';

@Controller('')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiTags('게시글 API')
  @ApiOperation({
    summary: '게시물 신고',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: ReportDto })
  @UseGuards(AuthGuardV2)
  @Post('articles/:articleId/report')
  @HttpCode(201)
  async reportPost(
    @Req() req: Request,
    @Body() body: ReportCreateRequestDto,
    @Param('articleId') targetId: number,
  ): Promise<ReportDto> {
    const userId = req.user.userId;
    return await this.reportsService.createReport({
      targetId,
      target: ReportTarget.ARTICLES,
      userId,
      ...body,
    });
  }

  @ApiTags('게시글 API')
  @ApiOperation({
    summary: '댓글 신고',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: ReportDto })
  @UseGuards(AuthGuardV2)
  @Post('articles/comments/:commentId/report')
  @HttpCode(201)
  async reportComment(
    @Req() req: Request,
    @Body() body: ReportCreateRequestDto,
    @Param('commentId') targetId: number,
  ): Promise<ReportDto> {
    const userId = req.user.userId;
    return await this.reportsService.createReport({
      targetId,
      target: ReportTarget.COMMENTS,
      userId,
      ...body,
    });
  }

  @ApiTags('어드민 API')
  @ApiTags('유저 API')
  @ApiOperation({
    summary: '[어드민용] 신고 내역 조회',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [ReportDto] })
  @UseGuards(AuthGuardV2)
  @Get('users/admin/reports')
  async fetchAll(@Req() req: Request): Promise<ReportDto[]> {
    const userId = req.user.userId;
    return await this.reportsService.findReports({ userId });
  }
}
