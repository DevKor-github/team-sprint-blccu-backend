import { PickType } from '@nestjs/swagger';
import { AgreementDto } from '../common/agreement.dto';

export class AgreementGetContractRequestDto extends PickType(AgreementDto, [
  'agreementType',
] as const) {}
