import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DateOption } from 'src/common/enums/date-option';

export class NotificationsGetRequestDto {
  @ApiProperty({
    type: Boolean,
    description: '확인 된 알림 조회 여부(true: 조회, false: 스킵)',
    default: true,
  })
  isChecked: boolean;

  @ApiProperty({
    type: 'enun',
    enum: DateOption,
    description: '특정 기간 이후 알림 조회, null 일 경우 전체 조회',
    required: false,
    default: null,
  })
  @IsEnum(DateOption)
  @IsOptional()
  dateCreated?: DateOption;
}
