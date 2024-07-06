import { PartialType } from '@nestjs/swagger';
import { AnnouncementCreateRequestDto } from './announcement-create-request.dto';

export class AnnouncementPatchRequestDto extends PartialType(
  AnnouncementCreateRequestDto,
) {}
