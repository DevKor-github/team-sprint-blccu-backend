import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('유저 API')
@Controller('users')
export class UsersReadController {
  constructor(private readonly usersService: UsersService) {}
}
