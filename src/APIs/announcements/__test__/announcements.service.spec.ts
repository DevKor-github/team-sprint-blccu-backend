import { MockRepository } from '@/utils/test.utils';
import { AnnouncementsService } from '../announcements.service';

describe('AnnouncementsService', () => {
  let svc_agreements: AnnouncementsService;
  let repo_agreements: MockRepository<AnnouncementsRepository>;
  let dto_agreement: AgreementDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(AnnouncementsRepository),
          useValue: MockRepositoryFactory.getMockRepository(
            AnnouncementsRepository,
          ),
        },

        UsersValidateService,
        {
          provide: getRepositoryToken(UsersRepository),
          useValue: MockRepositoryFactory.getMockRepository(UsersRepository),
        },
      ],
    }).compile();

    svc_agreements = module.get<AnnouncementsService>(AnnouncementsService);
    repo_agreements = module.get<MockRepository<AnnouncementsRepository>>(
      getRepositoryToken(AnnouncementsRepository),
    );
    dto_agreement = {
      id: 1,
      userId: 1,
      agreementType: AgreementType.TERMS_OF_SERVICE,
      isAgreed: true,
      ...TEST_DATE_FIELDS,
    };
  });
});
