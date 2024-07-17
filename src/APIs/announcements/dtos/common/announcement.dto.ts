import { OmitType } from '@nestjs/swagger';
import { Announcement } from '../../entities/announcement.entity';

export class AnnouncementDto extends OmitType(Announcement, [] as const) {}
