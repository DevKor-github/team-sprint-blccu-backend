import { OmitType } from '@nestjs/swagger';
import { getUserFields } from 'src/utils/classUtils';
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
  'likes',
] as const) {}

export const USER_SELECT_OPTION: { [key: string]: boolean } =
  getUserFields().reduce(
    (options, field) => {
      options[field] = true;
      return options;
    },
    {} as { [key: string]: boolean },
  );
// getClassFields(
//   UserDto,
// ).reduce(
//   (options, field) => {
//     options[field] = true;
//     return options;
//   },
//   {} as { [key: string]: boolean },
// );
