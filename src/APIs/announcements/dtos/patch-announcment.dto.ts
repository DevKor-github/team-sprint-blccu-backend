import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAnouncementInput } from './create-announcement.dto';
import { IsNumber } from 'class-validator';

export class PatchAnnouncementInput extends PartialType(
  CreateAnouncementInput,
) {
  @IsNumber()
  @ApiProperty({ type: Number, description: '수정할 id' })
  id: number;
}
