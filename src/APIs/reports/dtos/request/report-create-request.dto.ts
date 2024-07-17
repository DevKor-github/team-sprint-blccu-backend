import { PickType } from '@nestjs/swagger';
import { Report } from '../../entities/report.entity';

export class ReportCreateRequestDto extends PickType(Report, [
  'content',
  'type',
]) {}
