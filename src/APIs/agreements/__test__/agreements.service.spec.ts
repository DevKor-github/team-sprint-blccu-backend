import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsService } from '../agreements.service';
import { AgreementsRepository } from '../agreements.repository';
import { UsersValidateService } from '@/APIs/users/services/users-validate-service';
import { AgreementDto } from '../dtos/common/agreement.dto';
import { Agreement } from '../entities/agreement.entity';
import { plainToClass } from 'class-transformer';
import fs from 'fs';
import { AgreementType } from '@/common/enums/agreement-type.enum';
import { BlccuException } from '@/common/blccu-exception';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository, MockRepositoryFactory } from '@/utils/test.utils';

describe('AgreementsService', () => {
  let svc_agreements: AgreementsService;
  let repo_agreements: MockRepository<AgreementsRepository>;
  let svc_usersValidate: UsersValidateService;

  const ent_agreement: Agreement = {
    id: 1,
    userId: 30000000,
    agreementType: AgreementType.TERMS_OF_SERVICE,
    isAgreed: true,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    dateDeleted: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgreementsService,
        {
          provide: getRepositoryToken(AgreementsRepository),
          useValue:
            MockRepositoryFactory.getMockRepository(AgreementsRepository),
        },
      ],
    }).compile();

    svc_agreements = module.get<AgreementsService>(AgreementsService);
    repo_agreements = module.get<MockRepository<AgreementsRepository>>(
      getRepositoryToken(AgreementsRepository),
    );
    svc_usersValidate = module.get<UsersValidateService>(UsersValidateService);
  });

  it('createAgreement_AgreementDto_ValidInput');
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
