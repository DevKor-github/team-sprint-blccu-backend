import { Controller } from '@nestjs/common';
import { AgreementsService } from './agreements.service';

@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}
}
