import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AgreementsRepository } from './agreements.repository';
import {
  IAgreementsServiceCreate,
  IAgreementsServicePatch,
} from './interfaces/agreements.service.interface';
import { FetchAgreementDto } from './dtos/fetch-agreement.dto';
import { UsersService } from '../users/users.service';
import path from 'path';
import fs from 'fs';

@Injectable()
export class AgreementsService {
  constructor(
    private readonly agreementsRepository: AgreementsRepository,
    private readonly usersService: UsersService,
  ) {}

  async adminCheck({ kakaoId }) {
    await this.usersService.adminCheck({ kakaoId });
  }

  async create({
    kakaoId,
    agreementType,
    isAgreed,
  }: IAgreementsServiceCreate): Promise<FetchAgreementDto> {
    return await this.agreementsRepository.save({
      agreementType,
      isAgreed,
      userKakaoId: kakaoId,
    });
  }

  async fetchContract({ agreementType }) {
    const fileName = agreementType + '.txt';
    const rootPath = process.cwd();
    const filePath = path.join(rootPath, 'src', 'assets', 'terms', fileName);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data;
  }

  async fetchOne({ id }): Promise<FetchAgreementDto> {
    return await this.agreementsRepository.findOne({ where: { id } });
  }

  async fetchAll({ kakaoId }): Promise<FetchAgreementDto[]> {
    return await this.agreementsRepository.find({ where: { user: kakaoId } });
  }

  async patch({
    userKakaoId,
    id,
    isAgreed,
  }: IAgreementsServicePatch): Promise<FetchAgreementDto> {
    const data = await this.fetchOne({ id });
    if (!data) throw new NotFoundException('데이터를 찾을 수 없습니다.');
    if (data.userKakaoId != userKakaoId)
      throw new ForbiddenException('권한이 없습니다.');
    // if(data.agreementType != AgreementType.MARKETING_CONSENT)
    data.isAgreed = isAgreed;
    return await this.agreementsRepository.save(data);
  }
}
