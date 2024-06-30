import { PartialType } from '@nestjs/swagger';
import { CreateAnouncementInput } from './create-announcement.dto';

export class PatchAnnouncementInput extends PartialType(
  CreateAnouncementInput,
) {}
