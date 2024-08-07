import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsService } from '../agreements.service';
import { AgreementsRepository } from '../agreements.repository';
import { UsersValidateService } from '@/APIs/users/services/users-validate-service';
import { AgreementType } from '@/common/enums/agreement-type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository, MockRepositoryFactory } from '@/utils/test.utils';
import {
  IAgreementsServiceCreate,
  IAgreementsServiceId,
} from '../interfaces/agreements.service.interface';
import { UsersRepository } from '@/APIs/users/users.repository';
import { AgreementDto } from '../dtos/common/agreement.dto';
import {
  BlccuException,
  BlccuExceptionTest,
  BlccuHttpException,
} from '@/common/blccu-exception';

describe('AgreementsService', () => {
  let svc_agreements: AgreementsService;
  let repo_agreements: MockRepository<AgreementsRepository>;
  let svc_usersValidate: UsersValidateService;

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
    svc_usersValidate = module.get<UsersValidateService>(UsersValidateService);
  });

  it('createAgreement_AgreementDto_ValidInput', async () => {
    const createAgreementInput: IAgreementsServiceCreate = {
      userId: 1,
      agreementType: AgreementType.TERMS_OF_SERVICE,
      isAgreed: true,
    };
    const createAgreementOutput: AgreementDto = {
      id: 1,
      ...createAgreementInput,
      dateCreated: expect.any(Date),
      dateUpdated: expect.any(Date),
      dateDeleted: expect.any(Date),
    };
    repo_agreements.save.mockResolvedValue(createAgreementOutput);
    const result = await svc_agreements.createAgreement(createAgreementInput);
    expect(result).toEqual(createAgreementOutput);
    expect(repo_agreements.save).toHaveBeenCalledWith(createAgreementInput);
  });

  it('existCheck_ThrowError_NotExist', async () => {
    const existCheckInput: IAgreementsServiceId = { agreementId: 1 };
    const findOneOutput: AgreementDto = null;
    repo_agreements.findOne.mockResolvedValue(findOneOutput);
    await expect(svc_agreements.existCheck(existCheckInput)).rejects.toThrow(
      BlccuExceptionTest('AGREEMENT_NOT_FOUND'),
    );
  });
});

//   it('createAgreement_ShouldReturnAgreementDto_ValidInput', async () => {
//     const result = await service.createAgreement({
//       userId: 1,
//       agreementType: AgreementType.TERMS_OF_SERVICE,
//       isAgreed: true,
//     });

//     expect(result).toEqual(agreementDto);
//     expect(repo.save).toHaveBeenCalledWith({
//       agreementType: AgreementType.TERMS_OF_SERVICE,
//       isAgreed: true,
//       userId: 1,
//     });
//   });

//   it('findContract_ShouldReturnContractHtml_ValidAgreementType', async () => {
//     const agreementType = AgreementType.TERMS_OF_SERVICE;
//     const mockData = '<html>Contract Terms</html>';

//     jest.spyOn(fs.promises, 'readFile').mockResolvedValue(mockData);

//     const result = await service.findContract({ agreementType });

//     expect(result).toBe(mockData);
//   });

//   it('findAgreement_ShouldReturnAgreementDto_ValidAgreementId', async () => {
//     const result = await service.findAgreement({ agreementId: 1 });

//     expect(result).toEqual(agreementDto);
//     expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
//   });

//   it('existCheck_ShouldThrowBlccuException_AgreementNotFound', async () => {
//     jest.spyOn(service, 'findAgreement').mockResolvedValue(null);

//     await expect(service.existCheck({ agreementId: 1 })).rejects.toThrow(
//       new BlccuException('AGREEMENT_NOT_FOUND'),
//     );
//   });

//   it('findAgreements_ShouldReturnAgreementDtoArray_ValidUserId', async () => {
//     const result = await service.findAgreements({ userId: 1 });

//     expect(result).toEqual([agreementDto]);
//     expect(repo.find).toHaveBeenCalledWith({ where: { user: { id: 1 } } });
//   });

//   it('patchAgreement_ShouldThrowBlccuException_NotTheOwner', async () => {
//     const otherUserAgreement: Agreement = { ...agreementEntity, userId: 2 };

//     jest.spyOn(service, 'existCheck').mockResolvedValue(otherUserAgreement);

//     await expect(
//       service.patchAgreement({
//         userId: 1,
//         agreementId: 1,
//         isAgreed: true,
//       }),
//     ).rejects.toThrow(new BlccuException('NOT_THE_OWNER'));
//   });

//   it('patchAgreement_ShouldReturnUpdatedAgreement_ValidInput', async () => {
//     const updatedAgreement: Agreement = { ...agreementEntity, isAgreed: true };

//     jest.spyOn(service, 'existCheck').mockResolvedValue(agreementEntity);
//     jest.spyOn(repo, 'save').mockResolvedValue(updatedAgreement);

//     const result = await service.patchAgreement({
//       userId: 1,
//       agreementId: 1,
//       isAgreed: true,
//     });

//     expect(result).toEqual(plainToClass(AgreementDto, updatedAgreement));
//     expect(repo.save).toHaveBeenCalledWith(updatedAgreement);
//   });
// });
