import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersCreateService } from '../services/users-create.service';

@ApiTags('유저 API')
@Controller('users')
export class UsersCreateController {
  constructor(private readonly svc_usersCreate: UsersCreateService) {}
}
