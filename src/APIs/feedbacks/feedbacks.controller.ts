import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { FeedbackType } from 'src/common/enums/feedback-type.enum';
import { FeedbackDto } from './dtos/common/feedback.dto';
import { FeedbackCreateRequestDto } from './dtos/request/feedback-create-request.dto';
import { FeedbacksDocs } from './docs/feedbacks-docs.decorator';

@FeedbacksDocs
@ApiTags('유저 API')
@Controller('users')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @UseGuards(AuthGuardV2)
  @Post('feedback')
  async createFeedback(
    @Body() body: FeedbackCreateRequestDto,
    @Req() req: Request,
  ): Promise<FeedbackDto> {
    const userId = req.user.userId;
    return await this.feedbacksService.createFeedback({
      ...body,
      userId,
      type: FeedbackType.GENERAL_FEEDBACK,
    });
  }

  @UseGuards(AuthGuardV2)
  @Get('admin/feedbacks')
  async getFeedbacks(@Req() req: Request): Promise<FeedbackDto[]> {
    const userId = req.user.userId;
    return await this.feedbacksService.fetchFeedbacks({ userId });
  }
}
