import { OmitType } from '@nestjs/swagger';
import { AgreementDto } from '../common/agreement.dto';

export class AgreementCreateRequestDto extends OmitType(AgreementDto, [
  'id',
  'userId',
  'dateCreated',
  'dateUpdated',
  'dateDeleted',
] as const) {}
