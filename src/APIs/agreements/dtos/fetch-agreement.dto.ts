import { OmitType } from '@nestjs/swagger';
import { Agreement } from '../entities/agreement.entity';

export class FetchAgreementDto extends OmitType(Agreement, ['user']) {}
