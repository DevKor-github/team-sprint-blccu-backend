import { Injectable } from '@nestjs/common';
import { AgreementsRepository } from './agreements.repository';
import {
  IAgreementsServiceCreate,
  IAgreementsServiceId,
  IAgreementsServicePatchAgreement,
  IAgreementsServiceUserId,
} from './interfaces/agreements.service.interface';
import { UsersValidateService } from '../users/services/users-validate-service';
import { AgreementDto } from './dtos/common/agreement.dto';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';

@Injectable()
export class AgreementsService {
  constructor(
    private readonly repo_agreements: AgreementsRepository,
    private readonly svc_usersValidate: UsersValidateService,
  ) {}

  @MergeExceptionMetadata([
    { service: UsersValidateService, methodName: 'adminCheck' },
  ])
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

  @ExceptionMetadata([EXCEPTIONS.AGREEMENT_NOT_FOUND])
  async existCheck({
    agreementId,
  }: IAgreementsServiceId): Promise<AgreementDto> {
    const data = await this.findAgreement({ agreementId });
    if (!data) throw new BlccuException('AGREEMENT_NOT_FOUND');
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

  @MergeExceptionMetadata([
    { service: AgreementsService, methodName: 'existCheck' },
  ])
  @ExceptionMetadata([EXCEPTIONS.NOT_THE_OWNER])
  async patchAgreement({
    userId,
    agreementId,
    isAgreed,
  }: IAgreementsServicePatchAgreement): Promise<AgreementDto> {
    const data = await this.existCheck({ agreementId });
    if (data.userId != userId) throw new BlccuException('NOT_THE_OWNER');
    // if(data.agreementType != AgreementType.MARKETING_CONSENT)
    data.isAgreed = isAgreed;
    return await this.repo_agreements.save(data);
  }
}
