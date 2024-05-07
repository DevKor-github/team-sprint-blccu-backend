import { Announcement } from '../entities/announcement.entity';

export interface IAnnouncementsSerciceCreate
  extends Omit<
    Announcement,
    'id' | 'date_created' | 'date_updated' | 'date_deleted'
  > {
  kakaoId: number;
}

export interface IAnnouncementsSerciceRemove {
  kakaoId: number;
  id: number;
}

export interface IAnnouncementsSercicePatch {
  kakaoId: number;
  id: number;
  title?: string;
  content?: string;
}
