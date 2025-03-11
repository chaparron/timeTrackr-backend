import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorMessage = 
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as { message?: string | string[] }).message
        : exceptionResponse;

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.getUserFriendlyMessage(status, errorMessage),
      details: Array.isArray(errorMessage) ? errorMessage : undefined,
    };

    this.logger.error(
      `HTTP Error ${status} - ${request.method} ${request.url} - ${exception.message}`,
      exception.stack
    );

    response.status(status).json(responseBody);
  }

  private getUserFriendlyMessage(status: number, error: any): string {
    const statusMessages = {
      400: 'Solicitud incorrecta',
      401: 'No autorizado',
      403: 'Prohibido',
      404: 'Recurso no encontrado',
      500: 'Error interno del servidor',
    };

    if (typeof error === 'string') return error;
    if (Array.isArray(error)) return 'Validation error';
    
    return statusMessages[status] || 'Unexpected error';
  }
}