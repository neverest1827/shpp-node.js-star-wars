import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // console.error('Exception caught by global filter:', exception); If need check error;

    if (exception instanceof NotFoundException) {
      response.status(404).render('404', { url: request.url });
    } else {
      let message: string | object = 'Internal server error';

      if (exception instanceof HttpException) {
        const response: string | object = exception.getResponse();

        // If response is an object, take message from it
        if (typeof response === 'object' && response !== null) {
          message = response['message'] || message;
        } else {
          // If response is a string
          message = response;
        }
      } else {
        // For other types of errors use just exception.message
        message = exception.message || message;
      }

      response.status(status).json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }
  }
}
