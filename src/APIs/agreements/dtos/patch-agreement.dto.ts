import { PickType } from '@nestjs/swagger';
import { Agreement } from '../entities/agreement.entity';

export class PatchAgreementInput extends PickType(Agreement, ['isAgreed']) {}
