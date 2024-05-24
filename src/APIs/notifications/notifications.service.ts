import { BadRequestException, Injectable, MessageEvent } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { Observable, Subject, filter, map } from 'rxjs';
import { Notification } from './entities/notification.entity';
import { EmitNotiDto } from './dtos/emit-noti.dto';
import { FetchNotiDto, FetchNotiResponse } from './dtos/fetch-noti.dto';
import { DateOption } from 'src/common/enums/date-option';
import {
  INotificationsServiceConnectUser,
  INotificationsServiceRead,
} from './interfaces/notifications.service.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('audio') private redisQueue: Queue,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}
  private notis$: Subject<Notification> = new Subject();
  private observer = this.notis$.asObservable();
  private readonly queueName = 'audio';

  onModuleInit() {
    this.redisQueue.process(this.queueName, async (job) => {
      const data = job.data;
      this.notis$.next(data);
    });
  }

  onModuleDestroy() {
    this.redisQueue.close();
  }

  connectUser({
    targetUserKakaoId,
  }: INotificationsServiceConnectUser): Observable<MessageEvent> {
    console.log('connected: ' + targetUserKakaoId);
    const pipe = this.observer.pipe(
      filter((noti) => noti.targetUserKakaoId == targetUserKakaoId),
      map((noti) => {
        return {
          data: noti,
        } as MessageEvent;
      }),
    );
    return pipe;
  }

  async emitAlarm({
    userKakaoId,
    targetUserKakaoId,
    url,
    type,
  }: EmitNotiDto): Promise<FetchNotiResponse> {
    try {
      const executeResult = await this.notificationsRepository.createOne({
        userKakaoId,
        targetUserKakaoId,
        url,
        type,
      });
      const id = executeResult.identifiers[0].id;
      const data = await this.notificationsRepository.findOne({
        where: { id },
      });
      // Redis 큐에 이벤트를 전송
      await this.redisQueue.add(this.queueName, data);
      return data;
    } catch (e) {
      throw new BadRequestException('대상을 찾을 수 없습니다.');
    }
  }

  async fetch({
    is_checked,
    kakaoId,
    date_created,
  }: FetchNotiDto): Promise<FetchNotiResponse[]> {
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

  async read({
    id,
    targetUserKakaoId,
  }: INotificationsServiceRead): Promise<FetchNotiResponse> {
    const updateResult = await this.notificationsRepository.update(
      { id, targetUserKakaoId },
      {
        is_checked: true,
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
