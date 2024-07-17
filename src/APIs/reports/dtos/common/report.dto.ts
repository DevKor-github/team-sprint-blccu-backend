import { OmitType } from '@nestjs/swagger';
import { Report } from '../../entities/report.entity';

export class ReportDto extends OmitType(Report, [
  'article',
  'comment',
  'targetUser',
  'user',
]) {}
