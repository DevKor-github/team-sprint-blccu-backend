import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateReportInput,
  CreateReportResponse,
} from './dtos/create-report.dto';
import { AuthGuardV2 } from 'src/commons/guards/auth.guard';
import { Request } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({
    summary: '게시물 || 댓글 신고',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: CreateReportResponse })
  @UseGuards(AuthGuardV2)
  @Post()
  @HttpCode(201)
  async report(
    @Req() req: Request,
    @Body() body: CreateReportInput,
  ): Promise<CreateReportResponse> {
    const userKakaoId = req.user.userId;
    return await this.reportsService.create({ userKakaoId, ...body });
  }
}
