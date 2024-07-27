import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { AnnouncementDto } from './dtos/common/announcement.dto';
import { AnnouncementPatchRequestDto } from './dtos/request/announcement-patch-request.dto';
import { AnnouncementCreateRequestDto } from './dtos/request/announcement-create-request.dto';
import { ApiResponseFromMetadata } from '@/common/decorators/api-response-from-metadata.decorator';
import { AnnouncementsDocs } from './docs/announcements-docs.decorator';

@AnnouncementsDocs
@ApiTags('공지 API')
@Controller()
export class AnnouncementsController {
  constructor(private readonly svc_annoucements: AnnouncementsService) {}

  @UseGuards(AuthGuardV2)
  @Post('users/admin/anmts')
  @ApiResponseFromMetadata([
    { service: AnnouncementsService, methodName: 'createAnnoucement' },
  ])
  async createAnnouncement(
    @Req() req: Request,
    @Body() body: AnnouncementCreateRequestDto,
  ): Promise<AnnouncementDto> {
    const userId = req.user.userId;
    return await this.svc_annoucements.createAnnoucement({
      ...body,
      userId,
    });
  }

  @Get('anmts')
  async getAnnouncements(): Promise<AnnouncementDto[]> {
    return await this.svc_annoucements.getAnnouncements();
  }

  @UseGuards(AuthGuardV2)
  @Patch('users/admin/anmts/:announcementId')
  async patchAnnouncement(
    @Req() req: Request,
    @Body() body: AnnouncementPatchRequestDto,
    @Param('announcementId') announcementId: number,
  ): Promise<AnnouncementDto> {
    const userId = req.user.userId;
    return await this.svc_annoucements.patchAnnouncement({
      ...body,
      announcementId,
      userId,
    });
  }

  @UseGuards(AuthGuardV2)
  @Delete('users/admin/anmts/:announcementId')
  async removeAnnouncement(
    @Req() req: Request,
    @Param('announcementId') announcementId: number,
  ): Promise<AnnouncementDto> {
    const userId = req.user.userId;
    return await this.svc_annoucements.removeAnnouncement({
      userId,
      announcementId,
    });
  }
}
