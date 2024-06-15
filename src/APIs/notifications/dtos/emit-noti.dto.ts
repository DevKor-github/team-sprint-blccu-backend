import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';
export class EmitNotiDto extends PickType(Notification, [
  'userKakaoId',
  'targetUserKakaoId',
  'type',
]) {
  @ApiProperty({
    type: Number,
    description: '알림이 발생한 게시글 id(nullable)',
  })
  postId: number;
}

export class EmitNotiInput extends OmitType(EmitNotiDto, ['userKakaoId']) {}
