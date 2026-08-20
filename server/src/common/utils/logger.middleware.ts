import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly corsDomains: string[];

  constructor() {
    this.corsDomains = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, url, ip } = req;

    // Log after response
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      // Don't log health checks
      if (url.includes('/health')) return;

      // Sanitize sensitive headers
      const sanitizedHeaders = { ...req.headers };
      delete sanitizedHeaders['authorization'];
      delete sanitizedHeaders['cookie'];

      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          method,
          url,
          status: statusCode,
          duration: `${duration}ms`,
          ip,
          userAgent: req.get('user-agent'),
        }),
      );
    });

    next();
  }
}
