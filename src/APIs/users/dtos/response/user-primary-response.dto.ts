import { PickType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { getClassFields } from 'src/utils/classUtils';

export class UserPrimaryResponseDto extends PickType(User, [
  'id',
  'username',
  'profileImage',
  'handle',
]) {}

export const USER_PRIMARY_SELECT_OPTION: { [key: string]: boolean } =
  getClassFields(UserPrimaryResponseDto).reduce(
    (options, field) => {
      options[field] = true;
      return options;
    },
    {} as { [key: string]: boolean },
  );
