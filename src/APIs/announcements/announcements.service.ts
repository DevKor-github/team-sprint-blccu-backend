import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { Repository } from 'typeorm';
import {
  IAnnouncementsSerciceCreate,
  IAnnouncementsSercicePatch,
  IAnnouncementsSerciceRemove,
} from './interfaces/announcements.service.interface';
import { UsersService } from '../users/users.service';
import { AnnouncementResponseDto } from './dtos/announcement-response.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly annoucementsRepository: Repository<Announcement>,
    private readonly usersService: UsersService,
  ) {}

  async create({
    kakaoId,
    title,
    content,
  }: IAnnouncementsSerciceCreate): Promise<AnnouncementResponseDto> {
    await this.usersService.adminCheck({ kakaoId });
    return await this.annoucementsRepository.save({ title, content });
  }

  async fetchAll(): Promise<AnnouncementResponseDto[]> {
    return await this.annoucementsRepository.find();
  }

  async patch({
    kakaoId,
    id,
    title,
    content,
  }: IAnnouncementsSercicePatch): Promise<AnnouncementResponseDto[]> {
    await this.usersService.adminCheck({ kakaoId });
    const anmt = await this.annoucementsRepository.findOne({ where: { id } });
    if (!anmt) throw new NotFoundException('공지를 찾을 수 없습니다.');
    if (title) anmt.title = title;
    if (content) anmt.content = content;
    await this.annoucementsRepository.save(anmt);
    return await this.annoucementsRepository.find({ where: { id: anmt.id } });
  }

  async remove({
    kakaoId,
    id,
  }: IAnnouncementsSerciceRemove): Promise<AnnouncementResponseDto> {
    await this.usersService.adminCheck({ kakaoId });
    const anmt = await this.annoucementsRepository.findOne({ where: { id } });
    if (!anmt) throw new NotFoundException('공지를 찾을 수 없습니다.');
    return await this.annoucementsRepository.softRemove(anmt);
  }
}
