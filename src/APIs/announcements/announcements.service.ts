import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { Repository } from 'typeorm';
import { IAnnouncementsSerciceCreate } from './interfaces/announcements.service.interface';
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
}
