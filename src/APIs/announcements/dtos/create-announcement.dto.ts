import { OmitType } from '@nestjs/swagger';
import { Announcement } from '../entities/announcement.entity';

export class CreateAnouncementInput extends OmitType(Announcement, [
  'date_created',
  'date_deleted',
  'date_updated',
  'id',
]) {}
