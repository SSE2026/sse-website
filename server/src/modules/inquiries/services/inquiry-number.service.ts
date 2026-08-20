import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { InquiryType, ActivityType } from '@prisma/client';

/**
 * Inquiry Number Service
 * Generates unique, concurrent-safe inquiry numbers
 *
 * Format: INQ-YYYYMMDD-XXXX
 * Example: INQ-20260802-0001
 *
 * Uses database unique constraint for concurrency safety
 */
@Injectable()
export class InquiryNumberService {
  private readonly logger = new Logger(InquiryNumberService.name);
  private readonly MAX_RETRIES = 3;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a unique inquiry number
   * Uses Serializable transaction to ensure uniqueness under concurrency
   */
  async generate(): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const number = await this.generateWithRetry();
        return number;
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Inquiry number generation attempt ${attempt + 1} failed: ${error}`);
        // Small delay before retry
        await this.delay(50 * (attempt + 1));
      }
    }

    this.logger.error(`Failed to generate inquiry number after ${this.MAX_RETRIES} attempts`);
    throw lastError;
  }

  /**
   * Generate inquiry number within a transaction
   */
  async generateWithTx(tx: any): Promise<string> {
    const date = new Date();
    const dateStr = this.formatDate(date);

    // Find the highest sequence number for today
    const todayStart = new Date(date);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const lastInquiry = await tx.inquiry.findFirst({
      where: {
        inquiryNumber: {
          startsWith: `INQ-${dateStr}`,
        },
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      orderBy: {
        inquiryNumber: 'desc',
      },
      select: {
        inquiryNumber: true,
      },
    });

    let seq = 1;
    if (lastInquiry) {
      const parts = lastInquiry.inquiryNumber.split('-');
      const lastSeq = parseInt(parts[2], 10);
      seq = lastSeq + 1;
    }

    const inquiryNumber = `INQ-${dateStr}-${String(seq).padStart(4, '0')}`;
    this.logger.debug(`Generated inquiry number: ${inquiryNumber}`);

    return inquiryNumber;
  }

  /**
   * Generate with retry logic
   */
  private async generateWithRetry(): Promise<string> {
    return this.prisma.$transaction(async (tx) => {
      const date = new Date();
      const dateStr = this.formatDate(date);

      // Find the highest sequence number for today
      const todayStart = new Date(date);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const lastInquiry = await tx.inquiry.findFirst({
        where: {
          inquiryNumber: {
            startsWith: `INQ-${dateStr}`,
          },
          createdAt: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
        orderBy: {
          inquiryNumber: 'desc',
        },
        select: {
          inquiryNumber: true,
        },
      });

      let seq = 1;
      if (lastInquiry) {
        const parts = lastInquiry.inquiryNumber.split('-');
        const lastSeq = parseInt(parts[2], 10);
        seq = lastSeq + 1;
      }

      const inquiryNumber = `INQ-${dateStr}-${String(seq).padStart(4, '0')}`;
      this.logger.debug(`Generated inquiry number: ${inquiryNumber}`);

      return inquiryNumber;
    }, {
      isolationLevel: 'Serializable',
      timeout: 10000,
    });
  }

  /**
   * Format date as YYYYMMDD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
