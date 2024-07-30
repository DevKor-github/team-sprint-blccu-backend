import * as ERROR from '@/assets/errors.json';
import { ExceptionData } from './interfaces/exception-data.interface';
import { HttpException } from '@nestjs/common';

export type ExceptionNames = keyof typeof ERROR;

export const EXCEPTIONS: { [key in ExceptionNames]: ExceptionData } = ERROR;

export class BlccuHttpException extends HttpException {
  statusCode: number;
  errorCode: number;
  constructor(name: ExceptionNames) {
    const exception = EXCEPTIONS[name];
    super(exception.message, exception.statusCode);

    this.name = exception.name;
    this.statusCode = exception.statusCode;
    this.errorCode = exception.errorCode;

    // Capturing the stack trace keeps the reference to your error class
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export function BlccuException(name: ExceptionNames) {
  throw new BlccuHttpException(name);
}
