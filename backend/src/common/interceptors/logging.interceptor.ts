import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const requestId = (req.headers['x-request-id'] as string) || `req_${uuidv4().substring(0, 8)}`;
    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);

    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const statusCode = res.statusCode;
        this.logger.log(`[${requestId}] ${method} ${url} ${statusCode} - ${duration}ms`);
      }),
    );
  }
}
