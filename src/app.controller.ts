import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('healthcheck')
  healthCheck() {
    return { 
      status: 'ok', 
      timestamp: new Date(),
      environment: process.env.NODE_ENV
    };
  }
}