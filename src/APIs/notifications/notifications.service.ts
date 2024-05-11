import { BadRequestException, Injectable, MessageEvent } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { Subject, filter, map } from 'rxjs';
import { Notification } from './entities/notification.entity';
import { EmitNotiDto } from './dtos/emit-noti.dto';
import { FetchNotiDto, FetchNotiResponse } from './dtos/fetch-noti.dto';
import { DateOption } from 'src/common/enums/date-option';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}
  private notis$: Subject<Notification> = new Subject();
  private observer = this.notis$.asObservable();

  async connectUser(targetUserKakaoId) {
    console.log('connected: ' + targetUserKakaoId);
    const pipe = this.observer.pipe(
      filter((noti) => noti.targetUserKakaoId == targetUserKakaoId),
      map((noti) => {
        return {
          data: noti,
        } as MessageEvent;
      }),
    );
    // const data = { id: 1, targetUserKakaoId: 3388766789, };
    // this.users$.next(data);
    return pipe;
  }

  async emitAlarm(emitNotiDto: EmitNotiDto) {
    try {
      const executeResult =
        await this.notificationsRepository.createOne(emitNotiDto);
      const id = executeResult.identifiers[0].id;
      const data = await this.notificationsRepository.findOne({
        where: { id },
      });
      // next를 통해 이벤트를 생성
      this.notis$.next(data);
      return data;
    } catch (e) {
      throw new BadRequestException('대상을 찾을 수 없습니다.');
    }
  }

  async fetch({ is_checked, kakaoId, date_created }: FetchNotiDto) {
    let currentDate = new Date();

    switch (date_created) {
      case DateOption.WEEK:
        currentDate.setDate(currentDate.getDate() - 7);
        break;
      case DateOption.MONTH:
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case DateOption.YEAR:
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        currentDate = null;
    }
    return await this.notificationsRepository.fetchAll({
      is_checked,
      kakaoId,
      date_created: currentDate,
    });
  }

  async toggle({ id, targetUserKakaoId }): Promise<FetchNotiResponse> {
    const updateResult = await this.notificationsRepository.update(
      { id, targetUserKakaoId },
      {
        is_checked: () => '!is_checked',
      },
    );
    if (updateResult.affected < 1) {
      throw new BadRequestException('알림을 찾을 수 없거나 권한이 없습니다.');
    }
    return await this.notificationsRepository.findOne({
      where: { id, targetUserKakaoId },
    });
  }
}
