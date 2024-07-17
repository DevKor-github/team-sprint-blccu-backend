import { AgreementType } from 'src/common/enums/agreement-type.enum';
import { Agreement } from '../entities/agreement.entity';

export interface IAgreementsServiceCreate
  extends Omit<
    Agreement,
    'id' | 'user' | 'dateCreated' | 'dateUpdated' | 'dateDeleted'
  > {}

export interface IAgreementsServicePatchAgreement
  extends Pick<Agreement, 'isAgreed' | 'userId'> {
  agreementId: number;
}

export interface IAgreementsServiceUserId {
  userId: number;
}

export interface IAgreementsServiceId {
  agreementId: number;
}

export interface IAgreementsServiceFetchContract {
  agreementType: AgreementType;
}
