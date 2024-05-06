import { OmitType } from '@nestjs/swagger';
import { Report } from '../entities/report.entity';

export class CreateReportDto extends OmitType(Report, [
  'id',
  'user',
  'targetUser',
  'date_created',
]) {}

export class CreateReportInput extends OmitType(CreateReportDto, [
  'userKakaoId',
]) {}

export class CreateReportResponse extends OmitType(Report, [
  'user',
  'targetUser',
]) {}
