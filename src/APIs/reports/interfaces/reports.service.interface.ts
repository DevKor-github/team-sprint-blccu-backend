import { ReportDto } from '../dtos/common/report.dto';

export interface IReportsServiceCreateReport
  extends Pick<ReportDto, 'content' | 'target' | 'userId' | 'type'> {
  targetId: number;
}
