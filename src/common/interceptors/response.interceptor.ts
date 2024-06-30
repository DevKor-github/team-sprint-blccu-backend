import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = _context.switchToHttp().getRequest();

    const excludePaths = ['/metrics'];

    return next
      .handle()
      .pipe(defaultIfEmpty(null))
      .pipe(
        map((result) => {
          if (excludePaths.includes(req.url)) {
            return result;
          }
          // CAPA4.0 표준 응답으로 변환하여 반환
          return new ResponseObj(true, result);
        }),
      );
  }
}
export class ResponseObj {
  constructor(
    public success: boolean,
    public data: any,
  ) {}
}
