import { PickType } from '@nestjs/swagger';
import { Agreement } from '../entities/agreement.entity';

export class FetchContractDto extends PickType(Agreement, ['agreementType']) {}
