import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AgreementsRepository } from './agreements.repository';
import {
  IAgreementsServiceCreate,
  IAgreementsServiceFetchContract,
  IAgreementsServiceId,
  IAgreementsServicePatchAgreement,
  IAgreementsServiceUserId,
} from './interfaces/agreements.service.interface';
import path from 'path';
import fs from 'fs';
import { UsersValidateService } from '../users/services/users-validate-service';
import { AgreementDto } from './dtos/common/agreement.dto';

@Injectable()
export class AgreementsService {
  constructor(
    private readonly repo_agreements: AgreementsRepository,
    private readonly svc_usersValidate: UsersValidateService,
  ) {}

  async adminCheck({ userId }: IAgreementsServiceUserId): Promise<void> {
    await this.svc_usersValidate.adminCheck({ userId });
  }

  async createAgreement({
    userId,
    agreementType,
    isAgreed,
  }: IAgreementsServiceCreate): Promise<AgreementDto> {
    return await this.repo_agreements.save({
      agreementType,
      isAgreed,
      userId,
    });
  }

  async findContract({ agreementType }: IAgreementsServiceFetchContract) {
    const fileName = agreementType + '.html';
    const rootPath = process.cwd();
    const filePath = path.join(rootPath, 'src', 'assets', 'terms', fileName);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data;
  }

  async findAgreement({
    agreementId,
  }: IAgreementsServiceId): Promise<AgreementDto> {
    return await this.repo_agreements.findOne({ where: { id: agreementId } });
  }

  async findAgreements({
    userId,
  }: IAgreementsServiceUserId): Promise<AgreementDto[]> {
    return await this.repo_agreements.find({
      where: { user: { id: userId } },
    });
  }

  async patchAgreement({
    userId,
    agreementId,
    isAgreed,
  }: IAgreementsServicePatchAgreement): Promise<AgreementDto> {
    const data = await this.findAgreement({ agreementId });
    if (!data) throw new NotFoundException('데이터를 찾을 수 없습니다.');
    if (data.userId != userId) throw new ForbiddenException('권한이 없습니다.');
    // if(data.agreementType != AgreementType.MARKETING_CONSENT)
    data.isAgreed = isAgreed;
    return await this.repo_agreements.save(data);
  }
}
