import { Injectable, MessageEvent } from '@nestjs/common';
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
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';

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

  @ExceptionMetadata([EXCEPTIONS.NOTIFICATION_CREATION_FAILED])
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
      throw new BlccuException('NOTIFICATION_CREATION_FAILED');
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

  @ExceptionMetadata([EXCEPTIONS.NOTIFICATION_NOT_FOUND])
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
      throw new BlccuException('NOTIFICATION_NOT_FOUND');
    }
    return await this.notificationsRepository.fetchOne({
      notificationId,
      targetUserId,
    });
  }
}
