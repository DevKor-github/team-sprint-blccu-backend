import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { UsersService } from '../users/users.service';
import { FetchReportResponse } from './dtos/fetch-report.dto';
import { ReportTarget } from 'src/common/enums/report-target.enum';
import { Posts } from '../posts/entities/posts.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateReportDto): Promise<FetchReportResponse> {
    await this.usersService.existCheck({ kakaoId: dto.targetUserKakaoId });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { targetId, ...rest } = dto;
    try {
      let data;
      switch (dto.target) {
        case ReportTarget.POSTS:
          const postData = await queryRunner.manager.findOne(Posts, {
            where: { id: targetId },
          });
          if (!postData)
            throw new BadRequestException('게시글이 존재하지 않습니다.');

          const reportPost = await this.reportsRepository.findOne({
            where: { userKakaoId: dto.userKakaoId, postId: targetId },
          });
          if (reportPost)
            throw new ConflictException('이미 신고한 게시물입니다.');

          await queryRunner.manager.update(Posts, postData.id, {
            blame_count: () => 'blame_count +1',
          });
          data = await queryRunner.manager.save(Report, {
            ...rest,
            postId: targetId,
          });
          break;

        case ReportTarget.COMMENTS:
          const commentData = await queryRunner.manager.findOne(Comment, {
            where: { id: targetId },
          });
          if (!commentData)
            throw new BadRequestException('댓글이 존재하지 않습니다.');

          const reportComment = await this.reportsRepository.findOne({
            where: { userKakaoId: dto.userKakaoId, commentId: targetId },
          });
          if (reportComment)
            throw new ConflictException('이미 신고한 게시물입니다.');

          await queryRunner.manager.update(Comment, commentData.id, {
            blame_count: () => 'blame_count +1',
          });
          data = await queryRunner.manager.save(Report, {
            ...rest,
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

  async fetchAll({ kakaoId }): Promise<FetchReportResponse[]> {
    await this.usersService.adminCheck({ kakaoId });
    const result = await this.reportsRepository.find();
    return result;
  }
}
