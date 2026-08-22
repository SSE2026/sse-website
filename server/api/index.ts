/**
 * Vercel Serverless Entry Point
 *
 * At repo root so Vercel detects it as a serverless function.
 * Bundled by webpack into dist/api/index.js (same dir = __dirname resolves correctly).
 */
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication | null = null;

async function getApp(): Promise<INestApplication> {
  if (cachedApp) return cachedApp;

  const adapter = new ExpressAdapter();
  cachedApp = await NestFactory.create(AppModule, adapter);

  cachedApp.setGlobalPrefix('v1');

  const corsOrigin =
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    'https://sse-website.vercel.app';

  cachedApp.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await cachedApp.init();
  return cachedApp;
}

export default async function handler(req: any, res: any): Promise<void> {
  const app = await getApp();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
}
