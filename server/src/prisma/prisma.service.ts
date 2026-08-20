import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Initializing Prisma connection...');
    try {
      await this.$connect();
      this.logger.log('Prisma connected to database');
    } catch (error) {
      this.logger.error('Prisma connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting Prisma...');
    await this.$disconnect();
  }
}
