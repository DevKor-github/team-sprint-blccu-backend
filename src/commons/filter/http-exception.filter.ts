import { ExceptionFilter, HttpException, Catch } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('=========');
    console.log('예외 코드: ' + status);
    console.log('예외 내용: ' + message);
    console.log('=========');
  }
}
