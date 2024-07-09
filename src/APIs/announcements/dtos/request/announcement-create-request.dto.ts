import { OmitType } from '@nestjs/swagger';
import { AnnouncementDto } from '../common/announcement.dto';

export class AnnouncementCreateRequestDto extends OmitType(AnnouncementDto, [
  'dateCreated',
  'dateDeleted',
  'dateUpdated',
  'id',
] as const) {}
