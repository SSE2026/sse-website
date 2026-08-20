import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // API Prefix
  app.setGlobalPrefix('api/v1');

  // CORS Configuration
  const corsOrigin = process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000';

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Swift Safe Energy API')
    .setDescription('深安锂能国际站 B2B API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('认证', 'Authentication endpoints')
    .addTag('健康检查', 'Health check')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  const port = process.env.PORT || '3001';
  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 API Docs available at http://localhost:${port}/api/docs`);
  logger.log(`🔒 CORS enabled for: ${corsOrigin}`);
}

bootstrap();
