import { OmitType } from '@nestjs/swagger';
import { Agreement } from '../entities/agreement.entity';

export class CreateAgreementsInput extends OmitType(Agreement, [
  'id',
  'user',
  'date_created',
  'date_deleted',
  'date_updated',
]) {}
