import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersCreateService } from '../services/users-create.service';
import { UsersCreateDocs } from '../docs/users-create-docs.decorator';

@UsersCreateDocs
@ApiTags('유저 API')
@Controller('users')
export class UsersCreateController {
  constructor(private readonly svc_usersCreate: UsersCreateService) {}
}
