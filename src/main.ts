import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@infrastructure/filters/httpException.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureErrorHandling();
  setupGlobalPrefix(app);
  setupSwagger(app);
  setupValidation(app);
  setupCors(app);
  enableShutdownHooks(app);

  await startServer(app);
}

function configureErrorHandling() {
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });
  
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

function setupGlobalPrefix(app: any) {
  app.setGlobalPrefix('api');
}

function setupSwagger(app: any) {
  if (process.env.NODE_ENV === 'production') return;

  const config = new DocumentBuilder()
    .setTitle('TimeTrackr API')
    .setDescription('Api to perform your time tracking')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

function setupValidation(app: any) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}

function setupCors(app: any) {  
  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS ?? true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });
}

function enableShutdownHooks(app: any) {
  app.enableShutdownHooks();
}

async function startServer(app: any) {
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();