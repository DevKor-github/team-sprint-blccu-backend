import { PickType } from '@nestjs/swagger';
import { AgreementDto } from '../common/agreement.dto';

export class AgreementPatchRequestDto extends PickType(AgreementDto, [
  'isAgreed',
]) {}
