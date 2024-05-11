import { Injectable } from '@nestjs/common';
import { AgreementsRepository } from './agreements.repository';
import { IAgreementsServiceCreate } from './interfaces/agreements.service.interface';

@Injectable()
export class AgreementsService {
  constructor(private readonly agreementsRepository: AgreementsRepository) {}

  async create({ kakaoId, agreementType, isAgreed }: IAgreementsServiceCreate) {
    await this.agreementsRepository.save({
      agreementType,
      isAgreed,
      user: { kakaoId },
    });
  }
}
