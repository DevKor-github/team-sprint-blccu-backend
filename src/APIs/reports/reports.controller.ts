import {
  Body,
  Controller,
  Get,
  HttpCode,
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

@ApiTags('신고 API')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({
    summary: '게시물 || 댓글 신고',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: FetchReportResponse })
  @UseGuards(AuthGuardV2)
  @Post()
  @HttpCode(201)
  async report(
    @Req() req: Request,
    @Body() body: CreateReportInput,
  ): Promise<FetchReportResponse> {
    const userKakaoId = req.user.userId;
    return await this.reportsService.create({ userKakaoId, ...body });
  }

  @ApiOperation({
    summary: '[어드민용] 신고 내역 조회',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [FetchReportResponse] })
  @UseGuards(AuthGuardV2)
  @Get()
  async fetchAll(@Req() req: Request): Promise<FetchReportResponse[]> {
    const kakaoId = req.user.userId;
    return await this.reportsService.fetchAll({ kakaoId });
  }
}
