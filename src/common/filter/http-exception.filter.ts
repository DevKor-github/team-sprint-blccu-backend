import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { BlccuHttpException, EXCEPTIONS } from '../blccu-exception';
import { getTypeOrmError } from '@/utils/orm.utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const ormError = getTypeOrmError(exception);

    let status = EXCEPTIONS.INTERNAL_SERVER_ERROR.statusCode;
    let message: string | object;
    let errorCode = EXCEPTIONS.INTERNAL_SERVER_ERROR.errorCode;
    let name = EXCEPTIONS.INTERNAL_SERVER_ERROR.name;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      message = exceptionResponse?.message || exception.message;

      // class validator에서 발생한 에러의 경우(배열로 나옴)
      if (Array.isArray(message)) {
        errorCode = EXCEPTIONS.VALIDATION_ERROR.errorCode;
        name = EXCEPTIONS.VALIDATION_ERROR.name;
      }

      // 직접 발생시킨 예외의 경우
      if (exception instanceof BlccuHttpException) {
        errorCode = exception.errorCode;
        name = exception.name;
      }
      // orm 관련 에러의 경우
    } else if (ormError) {
      status = ormError.statusCode;
      message = (exception as Error).message || ormError.message;
      errorCode = ormError.errorCode;
      name = ormError.name;
      //  이외 모든 에러
    } else {
      message =
        (exception as Error).message ||
        EXCEPTIONS.INTERNAL_SERVER_ERROR.message;
    }

    const stack = (exception as Error).stack;

    console.log('=========');
    console.log(`예외 이름: ${name}`);
    console.log(`예외 코드: ${errorCode}`);
    console.log(`예외 내용: ${message}`);
    console.log(`호출 스택: ${stack}`);
    console.log('=========');

    response.status(status).json({
      name,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
