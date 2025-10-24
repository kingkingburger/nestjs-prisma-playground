import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ServerResponse } from 'http';
import { now } from '../time/time.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<ServerResponse> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const httpResponseObject = context
      .switchToHttp()
      .getResponse<ServerResponse>();

    const statusCode = httpResponseObject.statusCode;

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: statusCode,
          timestamp: now,
          // message: message,
          data: data,
        };
      }),
    );
  }
}
