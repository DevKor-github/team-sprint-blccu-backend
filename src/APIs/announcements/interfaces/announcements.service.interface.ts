import { Announcement } from '../entities/announcement.entity';

export interface IAnnouncementsSerciceCreateAnnouncement
  extends Omit<
    Announcement,
    'id' | 'dateCreated' | 'dateUpdated' | 'dateDeleted'
  > {
  userId: number;
}

export interface IAnnouncementsSerciceRemoveAnnouncement {
  userId: number;
  announcementId: number;
}

export interface IAnnouncementsSercicePatchAnnouncement {
  userId: number;
  announcementId: number;
  title?: string;
  content?: string;
}
