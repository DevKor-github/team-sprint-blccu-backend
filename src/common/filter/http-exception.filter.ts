import {
  ExceptionFilter,
  HttpException,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | object;

    if (
      typeof exceptionResponse === 'object' &&
      (exceptionResponse as any).message
    ) {
      const responseMessage = (exceptionResponse as any).message;
      if (
        Array.isArray(responseMessage) &&
        responseMessage[0] instanceof ValidationError
      ) {
        message = responseMessage
          .map((error: ValidationError) => {
            return `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints).join(', ')}`;
          })
          .join('; ');
      } else {
        message = responseMessage;
      }
    } else {
      message = exception.message;
    }

    console.log('=========');
    console.log('예외 코드: ' + status);
    console.log('예외 내용: ', message);
    console.log('=========');

    response.status(status).json({
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
