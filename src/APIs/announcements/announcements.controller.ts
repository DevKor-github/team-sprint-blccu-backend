import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/commons/guards/auth.guard';
import { Request } from 'express';
import { CreateAnouncementInput } from './dtos/create-announcement.dto';
import { AnnouncementResponseDto } from './dtos/announcement-response.dto';

@ApiTags('공지 API')
@Controller('anmt')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @ApiOperation({ summary: '[어드민용] 공지사항 작성' })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @ApiCreatedResponse({ type: AnnouncementResponseDto })
  @Post()
  @HttpCode(201)
  async createAnmt(
    @Req() req: Request,
    @Body() body: CreateAnouncementInput,
  ): Promise<AnnouncementResponseDto> {
    const kakaoId = req.user.userId;
    return await this.announcementsService.create({ ...body, kakaoId });
  }

  @ApiOperation({ summary: '공지사항 조회' })
  @ApiOkResponse({ type: [AnnouncementResponseDto] })
  @Get()
  async fetchAnmts(): Promise<AnnouncementResponseDto[]> {
    return await this.announcementsService.fetchAll();
  }

  @ApiOperation({
    summary: '[어드민용] 공지사항 삭제',
    description: 'id에 해당하는 공지사항 삭제, 삭제된 공지사항을 반환',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: AnnouncementResponseDto })
  @UseGuards(AuthGuardV2)
  @Delete(':id')
  async removeAnmt(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<AnnouncementResponseDto> {
    const kakaoId = req.user.userId;
    return await this.announcementsService.remove({ kakaoId, id });
  }
}
