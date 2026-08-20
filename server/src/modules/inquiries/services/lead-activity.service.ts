import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { LeadActivity, InquiryStatus, ActivityType, Prisma } from '@prisma/client';

/**
 * Lead Activity Service
 * Manages inquiry activity history and audit trail
 *
 * IMPORTANT: createdByName is always saved as a snapshot
 * even if the user is later deleted
 */
@Injectable()
export class LeadActivityService {
  private readonly logger = new Logger(LeadActivityService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a status change activity
   */
  async createStatusChange(
    inquiryId: string,
    oldStatus: InquiryStatus | null,
    newStatus: InquiryStatus,
    userId: string | null,
    userName: string,
    tx?: Prisma.TransactionClient,
  ): Promise<LeadActivity> {
    const db = tx || this.prisma;

    const activity = await db.leadActivity.create({
      data: {
        inquiryId,
        type: ActivityType.STATUS_CHANGE,
        title: oldStatus
          ? `Status changed: ${oldStatus} → ${newStatus}`
          : `Status set: ${newStatus}`,
        content: oldStatus
          ? `Inquiry status changed from **${oldStatus}** to **${newStatus}**`
          : `Inquiry created with status **${newStatus}**`,
        createdById: userId,
        createdByName: userName,
      },
    });

    this.logger.debug(`Created STATUS_CHANGE activity: ${activity.id}`);
    return activity;
  }

  /**
   * Create a manual activity (NOTE, EMAIL, CALL, etc.)
   */
  async createActivity(
    inquiryId: string,
    customerId: string | null,
    type: Exclude<ActivityType, 'STATUS_CHANGE'>,
    title: string,
    content: string | undefined,
    userId: string | null,
    userName: string,
    tx?: Prisma.TransactionClient,
  ): Promise<LeadActivity> {
    const db = tx || this.prisma;

    const activity = await db.leadActivity.create({
      data: {
        inquiryId,
        customerId,
        type,
        title,
        content: content || null,
        createdById: userId,
        createdByName: userName,
      },
    });

    this.logger.debug(`Created ${type} activity: ${activity.id}`);
    return activity;
  }

  /**
   * Get activities for an inquiry
   */
  async getByInquiry(
    inquiryId: string,
    params?: { page?: number; limit?: number },
  ): Promise<{ items: LeadActivity[]; total: number }> {
    const { page = 1, limit = 50 } = params || {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.leadActivity.findMany({
        where: { inquiryId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.leadActivity.count({ where: { inquiryId } }),
    ]);

    return { items, total };
  }
}
