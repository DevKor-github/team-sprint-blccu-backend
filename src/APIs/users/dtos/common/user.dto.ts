import { OmitType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { getClassFields } from 'src/utils/classUtils';

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
