import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  private logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {
    this.logger.log('HealthService instantiated');
  }

  async check(): Promise<{ status: string; database: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'error',
        database: 'disconnected',
      };
    }
  }
}
