import { OmitType } from '@nestjs/swagger';
import { Report } from '../entities/report.entity';

export class FetchReportResponse extends OmitType(Report, [
  'user',
  'targetUser',
  'post',
  'comment',
]) {}
