import { Injectable } from '@nestjs/common';
import { AgreementsRepository } from './agreements.repository';

@Injectable()
export class AgreementsService {
  constructor(private readonly agreementsRepository: AgreementsRepository) {}
}
