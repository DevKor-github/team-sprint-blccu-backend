import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { UsersService } from '../users/users.service';
import { FetchReportResponse } from './dtos/fetch-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateReportDto): Promise<FetchReportResponse> {
    await this.usersService.existCheck({ kakaoId: dto.targetUserKakaoId });
    const result = await this.reportsRepository.save(dto);
    return result;
  }

  async fetchAll({ kakaoId }): Promise<FetchReportResponse[]> {
    await this.usersService.adminCheck({ kakaoId });
    const result = await this.reportsRepository.find();
    return result;
  }
}
