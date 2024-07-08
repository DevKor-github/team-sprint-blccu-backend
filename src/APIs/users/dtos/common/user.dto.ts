import { OmitType } from '@nestjs/swagger';
import { getClassFields } from 'src/utils/classUtils';
import { User } from '../../entities/user.entity';

// exclude refreshtoken!!
export class UserDto extends OmitType(User, [
  'agreements',
  'articles',
  'articleCategories',
  'currentRefreshToken',
  'comments',
  'feedbacks',
  'followers',
  'followings',
  'receivedNotifications',
  'receivedReports',
  'sentNotifications',
  'sentReports',
  'stickers',
] as const) {}

export const USER_SELECT_OPTION: { [key: string]: boolean } = getClassFields(
  UserDto,
).reduce(
  (options, field) => {
    options[field] = true;
    return options;
  },
  {} as { [key: string]: boolean },
);
