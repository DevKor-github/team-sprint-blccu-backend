import {
  MockRepository,
  MockRepositoryFactory,
  MockService,
  MockServiceFactory,
  TEST_DATE_FIELDS,
} from '@/utils/test.utils';
import { AnnouncementsService } from '../announcements.service';
import { AnnouncementsRepository } from '../announcements.repository';
import { AnnouncementDto } from '../dtos/common/announcement.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersValidateService } from '@/APIs/users/services/users-validate-service';
import {
  IAnnouncementsServiceCreateAnnouncement,
  IAnnouncementsServiceId,
  IAnnouncementsServicePatchAnnouncement,
} from '../interfaces/announcements.service.interface';
import { UserDto } from '@/APIs/users/dtos/common/user.dto';
import {
  BlccuExceptionTest,
  BlccuHttpException,
} from '@/common/blccu-exception';

describe('AnnouncementsService', () => {
  let svc_announcements: AnnouncementsService;
  let repo_announcements: MockRepository<AnnouncementsRepository>;
  let svc_usersValidate: MockService<UsersValidateService>;

  let dto_announcement: AnnouncementDto;
  let dto_user: UserDto;
  let dto_adminUser: UserDto;

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
        {
          provide: UsersValidateService,
          useValue: MockServiceFactory.getMockService(UsersValidateService),
        },
      ],
    }).compile();

    svc_announcements = module.get<AnnouncementsService>(AnnouncementsService);
    repo_announcements = module.get<MockRepository<AnnouncementsRepository>>(
      getRepositoryToken(AnnouncementsRepository),
    );
    svc_usersValidate =
      module.get<MockService<UsersValidateService>>(UsersValidateService);
    dto_announcement = {
      id: 1,
      title: '공지사항',
      content: '공지내용',
      ...TEST_DATE_FIELDS,
    };
    dto_user = {
      id: 1,
      isAdmin: false,
      handle: 'user',
      username: '유저',
      followerCount: 0,
      followingCount: 0,
      description: '소개',
      profileImage: '',
      backgroundImage: '',
      ...TEST_DATE_FIELDS,
    };
    dto_adminUser = { ...dto_user, isAdmin: true };
  });

  describe('createAnnoucement', () => {
    const createAnnoucementInput: IAnnouncementsServiceCreateAnnouncement = {
      userId: 1,
      title: '공지사항',
      content: '공지내용',
    };

    it('should return AnnouncementDto with valid input', async () => {
      repo_announcements.save.mockResolvedValue(dto_announcement);
      svc_usersValidate.adminCheck.mockResolvedValue(dto_adminUser);
      const result = await svc_announcements.createAnnoucement(
        createAnnoucementInput,
      );
      expect(result).toEqual(dto_announcement);
      expect(repo_announcements.save).toHaveBeenCalledWith({
        title: createAnnoucementInput.title,
        content: createAnnoucementInput.content,
      });
    });

    it('should throw exception for invalid userId', async () => {
      repo_announcements.save.mockResolvedValue(dto_announcement);
      svc_usersValidate.adminCheck.mockRejectedValue(
        new BlccuHttpException('USER_NOT_FOUND'),
      );

      expect(
        svc_announcements.createAnnoucement(createAnnoucementInput),
      ).rejects.toThrow(BlccuExceptionTest('USER_NOT_FOUND'));
      expect(repo_announcements.save).not.toHaveBeenCalled();
    });

    it('should throw exception for non-admin user', async () => {
      repo_announcements.save.mockResolvedValue(dto_announcement);
      svc_usersValidate.adminCheck.mockRejectedValue(
        new BlccuHttpException('NOT_AN_ADMIN'),
      );

      expect(
        svc_announcements.createAnnoucement(createAnnoucementInput),
      ).rejects.toThrow(BlccuExceptionTest('NOT_AN_ADMIN'));
      expect(repo_announcements.save).not.toHaveBeenCalled();
    });
  });

  describe('existCheck', () => {
    it('should throw exception when announcement does not exist', async () => {
      const existCheckInput: IAnnouncementsServiceId = { announcementId: 1 };
      const findOneOutput: AnnouncementDto = null;
      repo_announcements.findOne.mockResolvedValue(findOneOutput);
      await expect(
        svc_announcements.existCheck(existCheckInput),
      ).rejects.toThrow(BlccuExceptionTest('ANNOUNCEMENT_NOT_FOUND'));
      expect(repo_announcements.findOne).toHaveBeenCalledWith({
        where: { id: existCheckInput.announcementId },
      });
    });

    it('should return AnnouncementDto when announcement exists', async () => {
      const existCheckInput: IAnnouncementsServiceId = { announcementId: 1 };
      repo_announcements.findOne.mockResolvedValue(dto_announcement);
      expect(svc_announcements.existCheck(existCheckInput)).resolves.toEqual(
        dto_announcement,
      );
      expect(repo_announcements.findOne).toHaveBeenCalledWith({
        where: { id: existCheckInput.announcementId },
      });
    });

    describe('patchAnnouncement', () => {
      const patchAnnouncementInput: IAnnouncementsServicePatchAnnouncement = {
        userId: 1,
        announcementId: 1,
        title: '수정된 제목',
        content: '수정된 내용',
      };

      it('should return AnnouncementDto with valid input', async () => {
        const patchAnnouncementOutput = {
          ...dto_announcement,
          title: patchAnnouncementInput.title,
          content: patchAnnouncementInput.content,
        };
        jest
          .spyOn(svc_announcements, 'existCheck')
          .mockResolvedValue(dto_announcement);
        svc_usersValidate.adminCheck.mockResolvedValue(dto_adminUser);

        repo_announcements.save.mockResolvedValue(patchAnnouncementOutput);
        repo_announcements.findOne.mockResolvedValue(patchAnnouncementOutput);

        await expect(
          svc_announcements.patchAnnouncement(patchAnnouncementInput),
        ).resolves.toEqual(patchAnnouncementOutput);

        expect(repo_announcements.findOne).toHaveBeenCalledWith({
          where: { id: patchAnnouncementInput.announcementId },
        });
        expect(repo_announcements.save).toHaveBeenCalledWith(
          patchAnnouncementOutput,
        );
      });

      it('should throw exception for invalid userId', async () => {
        const patchAnnouncementOutput = {
          ...dto_announcement,
          title: patchAnnouncementInput.title,
          content: patchAnnouncementInput.content,
        };
        repo_announcements.save.mockResolvedValue(patchAnnouncementOutput);
        repo_announcements.findOne.mockResolvedValue(patchAnnouncementOutput);
        svc_usersValidate.adminCheck.mockRejectedValue(
          new BlccuHttpException('USER_NOT_FOUND'),
        );
        jest
          .spyOn(svc_announcements, 'existCheck')
          .mockResolvedValue(dto_announcement);
        await expect(
          svc_announcements.patchAnnouncement(patchAnnouncementInput),
        ).rejects.toThrow(BlccuExceptionTest('USER_NOT_FOUND'));
        expect(svc_announcements.existCheck).not.toHaveBeenCalled();
        expect(repo_announcements.save).not.toHaveBeenCalled();
        expect(repo_announcements.findOne).not.toHaveBeenCalled();
      });

      it('should throw exception for non-admin user', async () => {
        const patchAnnouncementOutput = {
          ...dto_announcement,
          title: patchAnnouncementInput.title,
          content: patchAnnouncementInput.content,
        };
        repo_announcements.save.mockResolvedValue(patchAnnouncementOutput);
        repo_announcements.findOne.mockResolvedValue(patchAnnouncementOutput);
        svc_usersValidate.adminCheck.mockRejectedValue(
          new BlccuHttpException('NOT_AN_ADMIN'),
        );
        jest
          .spyOn(svc_announcements, 'existCheck')
          .mockResolvedValue(dto_announcement);
        await expect(
          svc_announcements.patchAnnouncement(patchAnnouncementInput),
        ).rejects.toThrow(BlccuExceptionTest('NOT_AN_ADMIN'));
        expect(svc_announcements.existCheck).not.toHaveBeenCalled();
        expect(repo_announcements.save).not.toHaveBeenCalled();
        expect(repo_announcements.findOne).not.toHaveBeenCalled();
      });

      it('should throw exception for invalid announcementId', async () => {
        const patchAnnouncementOutput = {
          ...dto_announcement,
          title: patchAnnouncementInput.title,
          content: patchAnnouncementInput.content,
        };
        repo_announcements.save.mockResolvedValue(patchAnnouncementOutput);
        repo_announcements.findOne.mockResolvedValue(patchAnnouncementOutput);
        svc_usersValidate.adminCheck.mockResolvedValue(dto_adminUser);
        svc_announcements.existCheck = jest.fn();
        jest
          .spyOn(svc_announcements, 'existCheck')
          .mockRejectedValue(new BlccuHttpException('ANNOUNCEMENT_NOT_FOUND'));

        await expect(
          svc_announcements.patchAnnouncement(patchAnnouncementInput),
        ).rejects.toThrow(BlccuExceptionTest('ANNOUNCEMENT_NOT_FOUND'));

        expect(repo_announcements.save).not.toHaveBeenCalled();
        expect(repo_announcements.findOne).not.toHaveBeenCalled();
      });
    });
    describe('removeAnnouncement', () => {
      it('should return AgreementDto with valid input', async () => {
        //arrange
        jest
          .spyOn(svc_announcements, 'existCheck')
          .mockResolvedValue(dto_announcement);
        svc_usersValidate.adminCheck.mockResolvedValue(dto_adminUser);
        repo_announcements.softRemove.mockResolvedValue(dto_announcement);
        //act
        const result = await svc_announcements.removeAnnouncement({
          userId: dto_adminUser.id,
          announcementId: dto_announcement.id,
        });
        //assert
        expect(result).toEqual(dto_announcement);
        expect(svc_usersValidate.adminCheck).toHaveBeenCalledWith({
          userId: dto_adminUser.id,
        });
        expect(svc_announcements.existCheck).toHaveBeenCalledWith({
          announcementId: dto_announcement.id,
        });
        expect(repo_announcements.softRemove).toHaveBeenCalledWith(
          dto_announcement,
        );
      });
    });
  });
});
