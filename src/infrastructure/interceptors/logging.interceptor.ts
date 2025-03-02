import { Injectable, NestInterceptor, ExecutionContext, CallHandler, } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { Logger } from '@nestjs/common';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, body, query, params } = request;
      const now = Date.now();
  
      this.logger.log(
        `Request: ${method} ${url}\nQuery: ${JSON.stringify(query)}\nParams: ${JSON.stringify(params)}\nBody: ${JSON.stringify(
          body,
        )}`,
      );
  
      return next.handle().pipe(
        tap((response) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Response: ${method} ${url} - Status: ${context.switchToHttp().getResponse().statusCode} - Response Time: ${responseTime}ms\nResponse Body: ${JSON.stringify(response)}\n`,
          );
        }),
      );
    }
  }