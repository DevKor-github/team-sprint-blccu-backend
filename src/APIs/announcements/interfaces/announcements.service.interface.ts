import { Announcement } from '../entities/announcement.entity';

export interface IAnnouncementsServiceCreateAnnouncement
  extends Omit<
    Announcement,
    'id' | 'dateCreated' | 'dateUpdated' | 'dateDeleted'
  > {
  userId: number;
}

export interface IAnnouncementsServiceRemoveAnnouncement {
  userId: number;
  announcementId: number;
}
export interface IAnnouncementsServiceId {
  announcementId: number;
}

export interface IAnnouncementsServicePatchAnnouncement {
  userId: number;
  announcementId: number;
  title?: string;
  content?: string;
}
