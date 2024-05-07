import { Announcement } from '../entities/announcement.entity';

export interface IAnnouncementsSerciceCreate
  extends Omit<
    Announcement,
    'id' | 'date_created' | 'date_updated' | 'date_deleted'
  > {
  kakaoId: number;
}
