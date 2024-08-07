import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsService } from '../agreements.service';
import { AgreementDto } from '../dtos/common/agreement.dto';
import {
  MockService,
  MockServiceFactory,
  TEST_DATE_FIELDS,
} from '@/utils/test.utils';
import { AgreementType } from '@/common/enums/agreement-type.enum';
import { AgreementsController } from '../agreements.controller';
import { AgreementCreateRequestDto } from '../dtos/request/agreement-create-request.dto';
import { Request } from 'express';

describe('AgreementsService', () => {
  let ctrl_agreements: AgreementsController;
  let svc_agreements: MockService<AgreementsService>;
  let dto_agreement: AgreementDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgreementsController],
      providers: [
        {
          provide: AgreementsService,
          useValue: MockServiceFactory.getMockService(AgreementsService),
        },
      ],
    }).compile();
    ctrl_agreements = module.get<AgreementsController>(AgreementsController);
    svc_agreements =
      module.get<MockService<AgreementsService>>(AgreementsService);
    dto_agreement = {
      id: 1,
      userId: 1,
      agreementType: AgreementType.TERMS_OF_SERVICE,
      isAgreed: true,
      ...TEST_DATE_FIELDS,
    };
  });

  describe('agree', () => {
    it('should return AgreementDto with valid input', async () => {
      const req = { user: { userId: 1 } } as Request;
      const dto: AgreementCreateRequestDto = {
        agreementType: AgreementType.TERMS_OF_SERVICE,
        isAgreed: true,
      };
      svc_agreements.createAgreement.mockResolvedValue(dto_agreement);

      const result = await ctrl_agreements.agree(req, dto);
      expect(result).toEqual(dto_agreement);
      expect(svc_agreements.createAgreement).toHaveBeenCalledWith({
        ...dto,
        userId: 1,
      });
    });
  });
});
