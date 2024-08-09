import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsController } from '../announcements.controller';
import { AnnouncementsService } from '../announcements.service';
import {
  MockService,
  MockServiceFactory,
  TEST_DATE_FIELDS,
} from '@/utils/test.utils';
import { Request } from 'express';
import { AnnouncementCreateRequestDto } from '../dtos/request/announcement-create-request.dto';
import { AnnouncementDto } from '../dtos/common/announcement.dto';
import exp from 'constants';
import { AnnouncementPatchRequestDto } from '../dtos/request/announcement-patch-request.dto';
import {
  BlccuExceptionTest,
  BlccuHttpException,
} from '@/common/blccu-exception';

describe('announcementsController', () => {
  let req: Request;
  let ctrl_announcements: AnnouncementsController;
  let svc_annoucements: MockService<AnnouncementsService>;
  let dto_announcement: AnnouncementDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        {
          provide: AnnouncementsService,
          useValue: MockServiceFactory.getMockService(AnnouncementsService),
        },
      ],
    }).compile();

    dto_announcement = {
      id: 1,
      title: '제목없음',
      content: '공지내용',
      ...TEST_DATE_FIELDS,
    };
    ctrl_announcements = module.get<AnnouncementsController>(
      AnnouncementsController,
    );
    svc_annoucements =
      module.get<MockService<AnnouncementsService>>(AnnouncementsService);
    req = { user: { userId: 1 } } as Request;
  });

  describe('createAnnouncement', () => {
    it('should return AnnouncementDto for valid input', async () => {
      // Arrange
      const dto_createAnnouncement: AnnouncementCreateRequestDto = {
        title: '제목없음',
        content: '공지내용',
      };
      svc_annoucements.createAnnoucement.mockResolvedValue(dto_announcement);
      // Act
      const result = await ctrl_announcements.createAnnouncement(
        req,
        dto_createAnnouncement,
      );
      // Assert
      expect(result).toEqual(dto_announcement);
      expect(svc_annoucements.createAnnoucement).toHaveBeenCalledWith({
        ...dto_createAnnouncement,
        userId: req.user.userId,
      });
    });
  });

  describe('getAnnouncements', () => {
    it('should return AnnoucementDto[] for any condition', async () => {
      //   Arrange
      svc_annoucements.getAnnouncements.mockResolvedValue([dto_announcement]);
      //   Act
      const result = await ctrl_announcements.getAnnouncements();
      //  Assert
      expect(result).toEqual([dto_announcement]);
      expect(svc_annoucements.getAnnouncements).toHaveBeenCalled();
    });
  });

  describe('patchAnnouncement', () => {
    it('should return AnnouncementDto for valid input', async () => {
      // Arrange
      const announcementId = 1;
      const dto_patchAnnouncement: AnnouncementPatchRequestDto = {
        title: '수정된 제목',
        content: '수정된 내용',
      };
      svc_annoucements.patchAnnouncement.mockResolvedValue({
        dto_announcement,
        ...dto_patchAnnouncement,
      });

      // Act
      const result = await ctrl_announcements.patchAnnouncement(
        req,
        dto_patchAnnouncement,
        announcementId,
      );
      // Assert
      expect(result).toEqual({ dto_announcement, ...dto_patchAnnouncement });
      expect(svc_annoucements.patchAnnouncement).toHaveBeenCalledWith({
        ...dto_patchAnnouncement,
        announcementId,
        userId: req.user.userId,
      });
    });

    it('should throw exception for non-admin user', async () => {
      // Arrange
      const announcementId = 1;
      const dto_patchAnnouncement: AnnouncementPatchRequestDto = {
        title: '수정된 제목',
        content: '수정된 내용',
      };
      svc_annoucements.patchAnnouncement.mockRejectedValue(
        new BlccuHttpException('NOT_AN_ADMIN'),
      );
      // Act
      const act = () =>
        ctrl_announcements.patchAnnouncement(
          req,
          dto_patchAnnouncement,
          announcementId,
        );
      // Assert
      expect(act()).rejects.toThrow(BlccuExceptionTest('NOT_AN_ADMIN'));
      expect(svc_annoucements.patchAnnouncement).toHaveBeenCalledWith({
        ...dto_patchAnnouncement,
        announcementId,
        userId: req.user.userId,
      });
    });
  });

  describe('removeAnnouncement', () => {
    it('should return AnnouncementDto for valid input', async () => {
      // Arrange
      const announcementId = 1;
      svc_annoucements.removeAnnouncement.mockResolvedValue(dto_announcement);
      // Act
      const result = await ctrl_announcements.removeAnnouncement(
        req,
        announcementId,
      );
      // Assert
      expect(result).toEqual(dto_announcement);
      expect(svc_annoucements.removeAnnouncement).toHaveBeenCalledWith({
        userId: req.user.userId,
        announcementId,
      });
    });
  });
});
