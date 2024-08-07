import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { Repository } from 'typeorm';
import {
  IAnnouncementsServiceCreateAnnouncement,
  IAnnouncementsServiceId,
  IAnnouncementsServicePatchAnnouncement,
  IAnnouncementsServiceRemoveAnnouncement,
} from './interfaces/announcements.service.interface';
import { UsersValidateService } from '../users/services/users-validate-service';
import { AnnouncementDto } from './dtos/common/announcement.dto';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { AnnouncementsRepository } from './announcements.repository';

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly repo_announcements: AnnouncementsRepository,
    private readonly svc_usersValidate: UsersValidateService,
  ) {}

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
  ])
  async createAnnoucement({
    userId,
    title,
    content,
  }: IAnnouncementsServiceCreateAnnouncement): Promise<AnnouncementDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    return await this.repo_announcements.save({ title, content });
  }

  async getAnnouncements(): Promise<AnnouncementDto[]> {
    return await this.repo_announcements.find();
  }

  @ExceptionMetadata([EXCEPTIONS.ANNOUNCEMENT_NOT_FOUND])
  async existCheck({
    announcementId,
  }: IAnnouncementsServiceId): Promise<AnnouncementDto> {
    const data = await this.repo_announcements.findOne({
      where: { id: announcementId },
    });
    if (!data) throw new BlccuException('ANNOUNCEMENT_NOT_FOUND');
    return data;
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
    { service: AnnouncementsService, methodName: 'existCheck' },
  ])
  async patchAnnouncement({
    userId,
    announcementId,
    title,
    content,
  }: IAnnouncementsServicePatchAnnouncement): Promise<AnnouncementDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    const anmt = await this.existCheck({ announcementId });
    if (title) anmt.title = title;
    if (content) anmt.content = content;
    await this.repo_announcements.save(anmt);
    return await this.repo_announcements.findOne({ where: { id: anmt.id } });
  }

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
    { service: AnnouncementsService, methodName: 'existCheck' },
  ])
  async removeAnnouncement({
    userId,
    announcementId,
  }: IAnnouncementsServiceRemoveAnnouncement): Promise<AnnouncementDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    const anmt = await this.existCheck({ announcementId });
    return await this.repo_announcements.softRemove(anmt);
  }
}
