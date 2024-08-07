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
import { AgreementPatchRequestDto } from '../dtos/request/agreement-patch-request.dto';

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

  describe('fetchAgreements', () => {
    it('should fetch agreements for the user', async () => {
      const req = { user: { userId: 1 } } as Request;
      svc_agreements.findAgreements.mockResolvedValue([dto_agreement]);

      const result = await ctrl_agreements.fetchAgreements(req);
      expect(result).toEqual([dto_agreement]);
      expect(svc_agreements.findAgreements).toHaveBeenCalledWith({ userId: 1 });
    });
  });

  describe('fetchAgreementAdmin', () => {
    it('should fetch agreements for the target user as admin', async () => {
      const req = { user: { userId: 1 } } as Request;
      const targetUserKakaoId = 2;
      svc_agreements.adminCheck.mockResolvedValue(true);
      svc_agreements.findAgreements.mockResolvedValue([dto_agreement]);

      const result = await ctrl_agreements.fetchAgreementAdmin(
        req,
        targetUserKakaoId,
      );
      expect(result).toEqual([dto_agreement]);
      expect(svc_agreements.adminCheck).toHaveBeenCalledWith({ userId: 1 });
      expect(svc_agreements.findAgreements).toHaveBeenCalledWith({
        userId: targetUserKakaoId,
      });
    });
  });
  describe('patchAgreement', () => {
    it('should patch an agreement', async () => {
      const req = { user: { userId: 1 } } as Request;
      const agreementId = 1;
      const patchAgreementInput: AgreementPatchRequestDto = { isAgreed: false };
      const patchAgreementOutput: AgreementDto = {
        ...dto_agreement,
        isAgreed: patchAgreementInput.isAgreed,
      };
      svc_agreements.patchAgreement.mockResolvedValue(patchAgreementOutput);

      const result = await ctrl_agreements.patchAgreement(
        req,
        agreementId,
        patchAgreementInput,
      );
      expect(result).toEqual(patchAgreementOutput);
      expect(svc_agreements.patchAgreement).toHaveBeenCalledWith({
        ...patchAgreementInput,
        agreementId,
        userId: req.user.userId,
      });
    });
  });
});
