import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { DataSource, Repository } from 'typeorm';
import { ReportTarget } from 'src/common/enums/report-target.enum';
import { Article } from '../articles/entities/article.entity';
import { Comment } from '../comments/entities/comment.entity';
import { IReportsServiceCreateReport } from './interfaces/reports.service.interface';
import { ReportDto } from './dtos/common/report.dto';
import { UsersValidateService } from '../users/services/users-validate-service';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repo_reports: Repository<Report>,
    private readonly svc_userValidate: UsersValidateService,
    private readonly db_dataSource: DataSource,
  ) {}

  @ExceptionMetadata([
    EXCEPTIONS.ARTICLE_NOT_FOUND,
    EXCEPTIONS.ALREADY_EXISTS,
    EXCEPTIONS.COMMENT_NOT_FOUND,
    EXCEPTIONS.VALIDATION_ERROR,
  ])
  async createReport(
    dto_createReport: IReportsServiceCreateReport,
  ): Promise<ReportDto> {
    const { target, userId, content, targetId, type } = dto_createReport;
    const queryRunner = this.db_dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let data;
      switch (target) {
        case ReportTarget.ARTICLES:
          const articleData = await queryRunner.manager.findOne(Article, {
            where: { id: targetId },
          });
          if (!articleData) throw new BlccuException('ARTICLE_NOT_FOUND');

          const reportPost = await this.repo_reports.findOne({
            where: { userId, articleId: targetId },
          });
          if (reportPost) throw new BlccuException('ALREADY_EXISTS');

          await queryRunner.manager.update(Article, articleData.id, {
            reportCount: () => 'report_count +1',
          });
          data = await queryRunner.manager.save(Report, {
            target,
            type,
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
          if (!commentData) throw new BlccuException('COMMENT_NOT_FOUND');

          const reportComment = await this.repo_reports.findOne({
            where: { userId, commentId: targetId },
          });
          if (reportComment) throw new BlccuException('ALREADY_EXISTS');
          await queryRunner.manager.update(Comment, commentData.id, {
            reportCount: () => 'report_count +1',
          });
          data = await queryRunner.manager.save(Report, {
            target,
            type,
            userId,
            targetUserId: commentData.userId,
            content,
            commentId: targetId,
          });
          break;

        default:
          throw new BlccuException('VALIDATION_ERROR');
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

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
  ])
  async findReports({ userId }): Promise<ReportDto[]> {
    await this.svc_userValidate.adminCheck({ userId });
    const result = await this.repo_reports.find();
    return result;
  }
}
