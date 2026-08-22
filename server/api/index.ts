/**
 * Simple Vercel Serverless Handler
 */
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedApp: any = null;

async function getApp() {
  if (cachedApp) return cachedApp;

  const adapter = new ExpressAdapter();
  cachedApp = await NestFactory.create(AppModule, adapter);

  // Set prefix: /v1 (Vercel maps /api to this function)
  cachedApp.setGlobalPrefix('v1');

  // CORS
  cachedApp.enableCors({
    origin: process.env.CORS_ORIGIN || 'https://sse-website.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await cachedApp.init();
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    const instance = app.getHttpAdapter().getInstance();
    instance(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
}
