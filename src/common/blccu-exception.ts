import * as ERROR from '@/assets/errors.json';
import { ExceptionData } from './interfaces/exception-data.interface';

export type ExceptionNames = keyof typeof ERROR;

export const EXCEPTIONS: { [key in ExceptionNames]: ExceptionData } = ERROR;

export class HttpException extends Error {
  statusCode: number;
  errorCode: number;
  constructor(name: ExceptionNames) {
    super(name);
    this.message = EXCEPTIONS[name].message;
    this.name = name;
    this.statusCode = EXCEPTIONS[name].statusCode;
    this.errorCode = EXCEPTIONS[name].errorCode;
  }
}

export function BlccuException(name: ExceptionNames) {
  throw new HttpException(name);
}
