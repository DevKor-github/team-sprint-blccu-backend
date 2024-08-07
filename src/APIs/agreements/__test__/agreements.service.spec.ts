import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsService } from '../agreements.service';
import { AgreementsRepository } from '../agreements.repository';
import { UsersValidateService } from '@/APIs/users/services/users-validate-service';
import { AgreementType } from '@/common/enums/agreement-type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  MockRepositoryFactory,
  TEST_DATE_FIELDS,
} from '@/utils/test.utils';
import {
  IAgreementsServiceCreate,
  IAgreementsServiceId,
  IAgreementsServicePatchAgreement,
  IAgreementsServiceUserId,
} from '../interfaces/agreements.service.interface';
import { UsersRepository } from '@/APIs/users/users.repository';
import { AgreementDto } from '../dtos/common/agreement.dto';
import { BlccuExceptionTest } from '@/common/blccu-exception';

describe('AgreementsService', () => {
  let svc_agreements: AgreementsService;
  let repo_agreements: MockRepository<AgreementsRepository>;
  let dto_agreement: AgreementDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgreementsService,
        {
          provide: getRepositoryToken(AgreementsRepository),
          useValue:
            MockRepositoryFactory.getMockRepository(AgreementsRepository),
        },

        UsersValidateService,
        {
          provide: getRepositoryToken(UsersRepository),
          useValue: MockRepositoryFactory.getMockRepository(UsersRepository),
        },
      ],
    }).compile();

    svc_agreements = module.get<AgreementsService>(AgreementsService);
    repo_agreements = module.get<MockRepository<AgreementsRepository>>(
      getRepositoryToken(AgreementsRepository),
    );
    dto_agreement = {
      id: 1,
      userId: 1,
      agreementType: AgreementType.TERMS_OF_SERVICE,
      isAgreed: true,
      ...TEST_DATE_FIELDS,
    };
  });
  describe('createAgreement', () => {
    it('should return AgreementDto with valid input', async () => {
      const createAgreementInput: IAgreementsServiceCreate = {
        userId: 1,
        agreementType: AgreementType.TERMS_OF_SERVICE,
        isAgreed: true,
      };
      const createAgreementOutput: AgreementDto = {
        id: 1,
        ...createAgreementInput,
        ...TEST_DATE_FIELDS,
      };
      repo_agreements.save.mockResolvedValue(createAgreementOutput);
      const result = await svc_agreements.createAgreement(createAgreementInput);
      expect(result).toEqual(createAgreementOutput);
      expect(repo_agreements.save).toHaveBeenCalledWith(createAgreementInput);
    });
  });

  describe('existCheck', () => {
    it('should throw exception when agreement does not exist', async () => {
      const existCheckInput: IAgreementsServiceId = { agreementId: 1 };
      const findOneOutput: AgreementDto = null;
      repo_agreements.findOne.mockResolvedValue(findOneOutput);
      await expect(svc_agreements.existCheck(existCheckInput)).rejects.toThrow(
        BlccuExceptionTest('AGREEMENT_NOT_FOUND'),
      );
      expect(repo_agreements.findOne).toHaveBeenCalledWith({
        where: { id: existCheckInput.agreementId },
      });
    });

    it('should return AgreementDto when agreement exists', async () => {
      const existCheckInput: IAgreementsServiceId = { agreementId: 1 };
      repo_agreements.findOne.mockResolvedValue(dto_agreement);
      await expect(svc_agreements.existCheck(existCheckInput)).resolves.toEqual(
        dto_agreement,
      );
      expect(repo_agreements.findOne).toHaveBeenCalledWith({
        where: { id: existCheckInput.agreementId },
      });
    });
  });

  describe('findAgreement', () => {
    it('should return AgreementDto with valid input', async () => {
      const findAgreementInput: IAgreementsServiceId = { agreementId: 1 };
      repo_agreements.findOne.mockResolvedValue(dto_agreement);
      await expect(
        svc_agreements.findAgreement(findAgreementInput),
      ).resolves.toEqual(dto_agreement);
      expect(repo_agreements.findOne).toHaveBeenCalledWith({
        where: { id: findAgreementInput.agreementId },
      });
    });
  });
  describe('findAgreements', () => {
    it('should return AgreementDtos with valid input', async () => {
      const findAgreementsInput: IAgreementsServiceUserId = { userId: 1 };
      repo_agreements.find.mockResolvedValue([dto_agreement]);
      await expect(
        svc_agreements.findAgreements(findAgreementsInput),
      ).resolves.toEqual([dto_agreement]);
      expect(repo_agreements.find).toHaveBeenCalledWith({
        where: { user: { id: findAgreementsInput.userId } },
      });
    });
  });

  describe('patchAgreement', () => {
    it('should return AgreementDto with valid input', async () => {
      const patchAgreementInput: IAgreementsServicePatchAgreement = {
        userId: 1,
        agreementId: 1,
        isAgreed: true,
      };
      const saveOutput: AgreementDto = {
        ...dto_agreement,
        isAgreed: patchAgreementInput.isAgreed,
      };
      repo_agreements.findOne.mockResolvedValue(dto_agreement);
      repo_agreements.save.mockResolvedValue(saveOutput);
      expect(await svc_agreements.patchAgreement(patchAgreementInput)).toEqual(
        saveOutput,
      );
      expect(repo_agreements.findOne).toHaveBeenCalledWith({
        where: { id: patchAgreementInput.agreementId },
      });
      expect(repo_agreements.save).toHaveBeenCalledWith({
        ...dto_agreement,
        isAgreed: patchAgreementInput.isAgreed,
      });
    });

    it('should throw exception for invalid agreementId', async () => {
      const patchAgreementInput: IAgreementsServicePatchAgreement = {
        userId: 1,
        agreementId: 1,
        isAgreed: true,
      };
      const findOneOutput: AgreementDto = null;
      const saveOutput: AgreementDto = {
        ...findOneOutput,
        isAgreed: patchAgreementInput.isAgreed,
      };
      repo_agreements.findOne.mockResolvedValue(findOneOutput);
      repo_agreements.save.mockResolvedValue(saveOutput);
      await expect(
        svc_agreements.patchAgreement(patchAgreementInput),
      ).rejects.toThrow(BlccuExceptionTest('AGREEMENT_NOT_FOUND'));
      expect(repo_agreements.findOne).toHaveBeenCalledWith({
        where: { id: patchAgreementInput.agreementId },
      });
    });

    it('should throw exception for invalid userId', async () => {
      const patchAgreementInput: IAgreementsServicePatchAgreement = {
        userId: 2,
        agreementId: 1,
        isAgreed: true,
      };
      const saveOutput: AgreementDto = {
        ...dto_agreement,
        isAgreed: patchAgreementInput.isAgreed,
      };
      repo_agreements.findOne.mockResolvedValue(dto_agreement);
      repo_agreements.save.mockResolvedValue(saveOutput);
      await expect(
        svc_agreements.patchAgreement(patchAgreementInput),
      ).rejects.toThrow(BlccuExceptionTest('NOT_THE_OWNER'));
      expect(repo_agreements.findOne).toHaveBeenCalledWith({
        where: { id: patchAgreementInput.agreementId },
      });
    });
  });
});
