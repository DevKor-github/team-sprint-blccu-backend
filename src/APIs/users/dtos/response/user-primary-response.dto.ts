import { PickType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
export const USER_PRIMARY_RESPONSE_DTO_KEYS: (keyof User)[] = [
  'id',
  'username',
  'profileImage',
  'handle',
];
export class UserPrimaryResponseDto extends PickType(
  User,
  USER_PRIMARY_RESPONSE_DTO_KEYS,
) {}

export const USER_PRIMARY_SELECT_OPTION: {
  [key in (typeof USER_PRIMARY_RESPONSE_DTO_KEYS)[number]]: boolean;
} = Object.fromEntries(
  USER_PRIMARY_RESPONSE_DTO_KEYS.map((key) => [key, true]),
) as { [key in (typeof USER_PRIMARY_RESPONSE_DTO_KEYS)[number]]: boolean };
