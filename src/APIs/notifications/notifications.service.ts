import { Injectable, MessageEvent } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { Observable, ReplaySubject, Subject, filter, map } from 'rxjs';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  // // [RxJS] Subject 선언 타입은 Users이다
  // private users$: Subject<Notification> = new Subject();

  // // 앞서 선언한 Subjcet를 Observable한 객체로 선언
  // private observer = this.users$.asObservable();

  // //접속한 브라우저의 커넥션을 담을 객체
  // private stream: {
  //   id: string;
  //   subject: ReplaySubject<unknown>;
  //   observer: Observable<unknown>;
  // }[] = [];

  // // 예시 데이터 ( DB 데이터라고 생각하자 )
  // users = [
  //   {
  //     id: 1,
  //     nickname: 'jewon',
  //     level: 1,
  //   },
  //   { id: 2, nickname: 'je', level: 2 },
  //   {
  //     id: 3,
  //     nickname: 'won',
  //     level: 3,
  //   },
  // ];

  // // [RxJS] User의 레벨 변화를 감시할 함수, 레벨업이 진행되면 Observable한 Subject에 next로 push
  // // onUserLevelChange(userId: number, nickname: string, level: number) {
  // //   // this.users$.next({ id: userId, nickname, level });
  // // }

  // //브라우저가 접속할 때 해당 스트림을 담아 둡니다.
  // addStream(
  //   subject: ReplaySubject<unknown>,
  //   observer: Observable<unknown>,
  //   id: string,
  // ): void {
  //   this.stream.push({
  //     id,
  //     subject,
  //     observer,
  //   });
  // }
  // // emitAlarm(kakaoId: number) {
  //   // next를 통해 이벤트를 생성
  //   this.users$.next({ kakaoId });
  // }

  // sendClientAlarm(kakaoId: number): Observable<any> {
  //   // 이벤트 발생시 처리 로직
  //   return this.observer.pipe(
  //     // 유저 필터링
  //     filter((user) => user.kakaoId === kakaoId),
  //     // 데이터 전송
  //     map((user) => {
  //       return {
  //         data: {
  //           message: '알람이 발생했습니다.',
  //         },
  //       } as MessageEvent;
  //     }),
  //   );
  // }
}
