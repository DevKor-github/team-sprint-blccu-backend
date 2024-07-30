import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ReportTarget } from 'src/common/enums/report-target.enum';
import { ReportDto } from './dtos/common/report.dto';
import { ReportCreateRequestDto } from './dtos/request/report-create-request.dto';
import { ReportsDocs } from './docs/reports-docs.decorator';

@ReportsDocs
@Controller('')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuardV2)
  @Post('articles/:articleId/report')
  async reportArticle(
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

  @UseGuards(AuthGuardV2)
  @Post('articles/comments/:commentId/report')
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

  @UseGuards(AuthGuardV2)
  @Get('users/admin/reports')
  async fetchAll(@Req() req: Request): Promise<ReportDto[]> {
    const userId = req.user.userId;
    return await this.reportsService.findReports({ userId });
  }
}
