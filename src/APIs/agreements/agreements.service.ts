import { Injectable } from '@nestjs/common';
import { AgreementsRepository } from './agreements.repository';
import { IAgreementsServiceCreate } from './interfaces/agreements.service.interface';
import { FetchAgreementDto } from './dtos/fetch-agreement.dto';
import { UsersService } from '../users/users.service';

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
      user: { kakaoId },
    });
  }

  async fetchAll({ kakaoId }): Promise<FetchAgreementDto[]> {
    return await this.agreementsRepository.find({ where: { user: kakaoId } });
  }
}
