import { BadRequestException, Injectable, MessageEvent } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { Observable, Subject, filter, map } from 'rxjs';
import { DateOption } from 'src/common/enums/date-option';
import {
  INotificationsServiceConnectUser,
  INotificationsServiceGetNotifications,
  INotificationsServiceRead,
  INotificationsSeviceEmitNotification,
} from './interfaces/notifications.service.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationsGetResponseDto } from './dtos/response/notifications-get-response.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('audio') private redisQueue: Queue,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}
  private notis$: Subject<NotificationsGetResponseDto> = new Subject();
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
    targetUserId,
  }: INotificationsServiceConnectUser): Observable<MessageEvent> {
    console.log('connected: ' + targetUserId);
    const pipe = this.observer.pipe(
      filter((noti) => noti.targetUserId == targetUserId),
      map((noti) => {
        return {
          data: noti,
        } as MessageEvent;
      }),
    );
    return pipe;
  }

  async emitAlarm({
    userId,
    targetUserId,
    type,
  }: INotificationsSeviceEmitNotification): Promise<NotificationsGetResponseDto> {
    try {
      const data = await this.notificationsRepository.save({
        userId,
        targetUserId,
        type,
      });
      const response = await this.notificationsRepository.fetchOne({
        notificationId: data.id,
        targetUserId,
      });
      // Redis 큐에 이벤트를 전송
      await this.redisQueue.add(this.queueName, response);
      return response;
    } catch (e) {
      throw new BadRequestException('대상을 찾을 수 없습니다.');
    }
  }

  async findNotifications({
    isChecked,
    userId,
    dateCreated,
  }: INotificationsServiceGetNotifications): Promise<
    NotificationsGetResponseDto[]
  > {
    let currentDate = new Date();

    switch (dateCreated) {
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
      isChecked,
      userId,
      dateCreated: currentDate,
    });
  }

  async readNotification({
    notificationId,
    targetUserId,
  }: INotificationsServiceRead): Promise<NotificationsGetResponseDto> {
    const updateResult = await this.notificationsRepository.update(
      { id: notificationId, targetUserId },
      {
        isChecked: true,
      },
    );
    if (updateResult.affected < 1) {
      throw new BadRequestException('알림을 찾을 수 없거나 권한이 없습니다.');
    }
    return await this.notificationsRepository.fetchOne({
      notificationId,
      targetUserId,
    });
  }
}
