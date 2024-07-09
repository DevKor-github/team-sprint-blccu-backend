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
import { AnnouncementsService } from './announcements.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { AnnouncementDto } from './dtos/common/announcement.dto';
import { AnnouncementPatchRequestDto } from './dtos/request/announcement-patch-request.dto';
import { AnnouncementCreateRequestDto } from './dtos/request/announcement-create-request.dto';

@ApiTags('공지 API')
@Controller()
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '[어드민용] 공지사항 작성' })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @ApiCreatedResponse({ type: AnnouncementDto })
  @Post('users/admin/anmts')
  @HttpCode(201)
  async createAnmt(
    @Req() req: Request,
    @Body() body: AnnouncementCreateRequestDto,
  ): Promise<AnnouncementDto> {
    const userId = req.user.userId;
    return await this.announcementsService.createAnnoucement({
      ...body,
      userId,
    });
  }

  @ApiOperation({ summary: '공지사항 조회' })
  @ApiOkResponse({ type: [AnnouncementDto] })
  @Get('anmts')
  async fetchAnmts(): Promise<AnnouncementDto[]> {
    return await this.announcementsService.getAnnouncements();
  }

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '[어드민용] 공지사항 수정' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: AnnouncementDto })
  @UseGuards(AuthGuardV2)
  @Patch('users/admin/anmts/:announcementId')
  async patchAnmt(
    @Req() req: Request,
    @Body() body: AnnouncementPatchRequestDto,
    @Param('announcementId') announcementId: number,
  ): Promise<AnnouncementDto> {
    const userId = req.user.userId;
    return await this.announcementsService.patchAnnouncement({
      ...body,
      announcementId,
      userId,
    });
  }

  @ApiTags('어드민 API')
  @ApiOperation({
    summary: '[어드민용] 공지사항 삭제',
    description: 'id에 해당하는 공지사항 삭제, 삭제된 공지사항을 반환',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: AnnouncementDto })
  @UseGuards(AuthGuardV2)
  @Delete('users/admin/anmts/:announcementId')
  async removeAnmt(
    @Req() req: Request,
    @Param('announcementId') announcementId: number,
  ): Promise<AnnouncementDto> {
    const userId = req.user.userId;
    return await this.announcementsService.removeAnnouncement({
      userId,
      announcementId,
    });
  }
}
