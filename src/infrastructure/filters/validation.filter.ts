import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const defaultResponse = exception.getResponse()

    const customResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: defaultResponse,
      }
    
    console.error('Validation Error:', {...customResponse, stack: exception.stack});

    response.status(status).json(customResponse);
  }
}