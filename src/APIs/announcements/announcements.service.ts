import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { Repository } from 'typeorm';
import {
  IAnnouncementsSerciceCreateAnnouncement,
  IAnnouncementsSercicePatchAnnouncement,
  IAnnouncementsSerciceRemoveAnnouncement,
} from './interfaces/announcements.service.interface';
import { UsersValidateService } from '../users/services/users-validate-service';
import { AnnouncementDto } from './dtos/common/announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly repo_announcements: Repository<Announcement>,
    private readonly svc_usersValidate: UsersValidateService,
  ) {}

  async createAnnoucement({
    userId,
    title,
    content,
  }: IAnnouncementsSerciceCreateAnnouncement): Promise<AnnouncementDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    return await this.repo_announcements.save({ title, content });
  }

  async getAnnouncements(): Promise<AnnouncementDto[]> {
    return await this.repo_announcements.find();
  }

  async patchAnnouncement({
    userId,
    announcementId,
    title,
    content,
  }: IAnnouncementsSercicePatchAnnouncement): Promise<AnnouncementDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    const anmt = await this.repo_announcements.findOne({
      where: { id: announcementId },
    });
    if (!anmt) throw new NotFoundException('공지를 찾을 수 없습니다.');
    if (title) anmt.title = title;
    if (content) anmt.content = content;
    await this.repo_announcements.save(anmt);
    return await this.repo_announcements.findOne({ where: { id: anmt.id } });
  }

  async removeAnnouncement({
    userId,
    announcementId,
  }: IAnnouncementsSerciceRemoveAnnouncement): Promise<AnnouncementDto> {
    await this.svc_usersValidate.adminCheck({ userId });
    const anmt = await this.repo_announcements.findOne({
      where: { id: announcementId },
    });
    if (!anmt) throw new NotFoundException('공지를 찾을 수 없습니다.');
    return await this.repo_announcements.softRemove(anmt);
  }
}
