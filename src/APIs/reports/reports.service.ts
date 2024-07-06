import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { DataSource, Repository } from 'typeorm';
import { ReportTarget } from 'src/common/enums/report-target.enum';
import { Article } from '../articles/entities/article.entity';
import { Comment } from '../comments/entities/comment.entity';
import { IReportsServiceCreateReport } from './interfaces/reports.service.interface';
import { ReportDto } from './dtos/common/report.dto';
import { UsersValidateService } from '../users/services/users-validate-service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repo_reports: Repository<Report>,
    private readonly svc_userValidate: UsersValidateService,
    private readonly db_dataSource: DataSource,
  ) {}

  async createReport(
    dto_createReport: IReportsServiceCreateReport,
  ): Promise<ReportDto> {
    const { target, userId, content, targetId } = dto_createReport;
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let data;
      switch (target) {
        case ReportTarget.POSTS:
          const articleData = await queryRunner.manager.findOne(Article, {
            where: { id: targetId },
          });
          if (!articleData)
            throw new BadRequestException('게시글이 존재하지 않습니다.');

          const reportPost = await this.repo_reports.findOne({
            where: { userId, articleId: targetId },
          });
          if (reportPost)
            throw new ConflictException('이미 신고한 게시물입니다.');

          await queryRunner.manager.update(Article, articleData.id, {
            reportCount: () => 'report_count +1',
          });
          data = await queryRunner.manager.save(Report, {
            target,
            userId,
            targetUserId: articleData.userId,
            content,
            articleId: targetId,
          });
          break;

        case ReportTarget.COMMENTS:
          const commentData = await queryRunner.manager.findOne(Comment, {
            where: { id: targetId },
          });
          if (!commentData)
            throw new BadRequestException('댓글이 존재하지 않습니다.');

          const reportComment = await this.repo_reports.findOne({
            where: { userId, commentId: targetId },
          });
          if (reportComment)
            throw new ConflictException('이미 신고한 게시물입니다.');

          await queryRunner.manager.update(Comment, commentData.id, {
            reportCount: () => 'report_count +1',
          });
          data = await queryRunner.manager.save(Report, {
            target,
            userId,
            targetUserId: commentData.userId,
            content,
            commentId: targetId,
          });
          break;

        default:
          throw new BadRequestException('잘못된 target입니다.');
      } // end of switch
      await queryRunner.commitTransaction();
      return data;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findReports({ userId }): Promise<ReportDto[]> {
    await this.svc_userValidate.adminCheck({ userId });
    const result = await this.repo_reports.find();
    return result;
  }
}
