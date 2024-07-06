import { OmitType } from '@nestjs/swagger';
import { Agreement } from '../../entities/agreement.entity';

export class AgreementDto extends OmitType(Agreement, ['user'] as const) {}
