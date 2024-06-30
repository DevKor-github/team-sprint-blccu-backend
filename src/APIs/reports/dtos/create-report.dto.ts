import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Report } from '../entities/report.entity';

export class CreateReportDto extends OmitType(Report, [
  'id',
  'user',
  'post',
  'postId',
  'comment',
  'commentId',
  'date_created',
]) {
  @ApiProperty({ type: Number, description: '신고할 게시글/댓글의 아이디' })
  targetId: number;
}

export class CreateReportInput extends OmitType(CreateReportDto, [
  'userKakaoId',
  'target',
  'targetId',
]) {}
