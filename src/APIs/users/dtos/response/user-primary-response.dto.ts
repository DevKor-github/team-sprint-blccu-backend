import { PickType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserPrimaryResponseDto extends PickType(User, [
  'id',
  'username',
  'profileImage',
  'handle',
]) {}

export const USER_PRIMARY_SELECT_OPTION: { [key: string]: boolean } = {
  id: true,
  username: true,
  profileImage: true,
  handle: true,
};
// getEntityFields(User).reduce(
//   (options, field) => {
//     options[field] = true;
//     return options;
//   },
//   {} as { [key: string]: boolean },
// );
