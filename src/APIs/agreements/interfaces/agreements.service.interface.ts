import { AgreementType } from 'src/common/enums/agreement-type.enum';
import { Agreement } from '../entities/agreement.entity';

export interface IAgreementsServiceCreate
  extends Omit<
    Agreement,
    | 'id'
    | 'user'
    | 'userKakaoId'
    | 'date_created'
    | 'date_updated'
    | 'date_deleted'
  > {
  kakaoId: number;
}

export interface IAgreementsServicePatch
  extends Pick<Agreement, 'id' | 'isAgreed' | 'userKakaoId'> {}

export interface IAgreementsServiceKakaoId {
  kakaoId: number;
}

export interface IAgreementsServiceId {
  id: number;
}

export interface IAgreementsServiceFetchContract {
  agreementType: AgreementType;
}
