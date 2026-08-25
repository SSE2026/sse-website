import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

const logger = new Logger('Bootstrap');

/**
 * Configure NestJS application - shared by both serverless and traditional modes
 */
async function configureApp(app: any): Promise<void> {
  // API Prefix
  app.setGlobalPrefix('v1');

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

  logger.log(`🔒 CORS enabled for: ${corsOrigin}`);
}

/**
 * Traditional server mode (for local development and Railway/Render/Koyeb)
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  await configureApp(app);

  const port = process.env.PORT || '3001';
  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 API Docs available at http://localhost:${port}/api/docs`);
}

// Vercel Serverless Handler
let cachedApp: any = null;

async function getApp(): Promise<any> {
  if (cachedApp) {
    return cachedApp;
  }

  cachedApp = await NestFactory.create(AppModule);
  await configureApp(cachedApp);
  await cachedApp.init();

  return cachedApp;
}

// Vercel Serverless Export
const vercelHandler = async (
  req: any,
  res: any
): Promise<void> => {
  const app = await getApp();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};

// Export for Vercel
export default vercelHandler;

// Export for traditional usage
export { bootstrap };

// Run traditional server if executed directly
if (require.main === module) {
  bootstrap();
}
