import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class UtilsService {
  getUUID(): string {
    return v4();
  }
}
