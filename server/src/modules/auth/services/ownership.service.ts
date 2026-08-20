import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthenticatedUser } from '../strategies/jwt.strategy';

/**
 * Ownership verification service for Customer Portal
 * Enforces User → Customer → Resource ownership chain
 */
@Injectable()
export class OwnershipService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get customer ID from authenticated user
   * Returns null if user has no linked customer
   */
  async getCustomerId(user: AuthenticatedUser): Promise<string | null> {
    return user.customerId ?? null;
  }

  /**
   * Verify user has a linked customer
   * Throws ForbiddenException if not
   */
  async requireCustomer(user: AuthenticatedUser): Promise<string> {
    if (!user.customerId) {
      throw new ForbiddenException({
        code: 'NO_CUSTOMER_LINKED',
        message: 'No customer account linked to this user',
      });
    }
    return user.customerId;
  }

  /**
   * Verify inquiry belongs to user's customer
   * Returns 404 (not 403) to hide resource existence
   */
  async verifyInquiryOwnership(user: AuthenticatedUser, inquiryId: string): Promise<void> {
    const customerId = await this.requireCustomer(user);

    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id: inquiryId },
      select: { customerId: true, deletedAt: true },
    });

    if (!inquiry || inquiry.deletedAt) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Inquiry not found',
      });
    }

    if (inquiry.customerId !== customerId) {
      // Return 404 to hide resource existence
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Inquiry not found',
      });
    }
  }

  /**
   * Verify document download belongs to user's customer
   * Returns 404 (not 403) to hide resource existence
   */
  async verifyDocumentDownloadOwnership(user: AuthenticatedUser, downloadId: string): Promise<void> {
    const customerId = await this.requireCustomer(user);

    const download = await this.prisma.documentDownload.findUnique({
      where: { id: downloadId },
      select: { customerId: true },
    });

    if (!download) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Document download not found',
      });
    }

    // If download has customerId, verify ownership
    if (download.customerId && download.customerId !== customerId) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Document download not found',
      });
    }
  }

  /**
   * Get inquiries owned by user's customer
   */
  async getCustomerInquiries(user: AuthenticatedUser, query: any = {}) {
    const customerId = await this.requireCustomer(user);

    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    // Build filters
    const where: any = {
      customerId,
      deletedAt: null,
    };

    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          attachments: true,
        },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      items,
      total,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single inquiry owned by user's customer
   */
  async getCustomerInquiry(user: AuthenticatedUser, inquiryId: string) {
    await this.verifyInquiryOwnership(user, inquiryId);

    return this.prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: {
        customer: {
          include: { company: true },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        attachments: true,
      },
    });
  }

  /**
   * Get document downloads owned by user's customer
   */
  async getCustomerDownloads(user: AuthenticatedUser, query: any = {}) {
    const customerId = await this.requireCustomer(user);

    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      customerId, // Only downloads with matching customerId
    };

    const [items, total] = await Promise.all([
      this.prisma.documentDownload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          document: {
            select: { id: true, name: true, nameEn: true, type: true },
          },
        },
      }),
      this.prisma.documentDownload.count({ where }),
    ]);

    return {
      items,
      total,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get customer profile
   */
  async getCustomerProfile(user: AuthenticatedUser) {
    const customerId = await this.requireCustomer(user);

    return this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        company: true,
        _count: {
          select: {
            inquiries: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });
  }

  /**
   * Get customer dashboard stats
   */
  async getCustomerDashboard(user: AuthenticatedUser) {
    const customerId = await this.requireCustomer(user);

    // Get inquiry stats
    const inquiryStats = await this.prisma.inquiry.groupBy({
      by: ['status'],
      where: {
        customerId,
        deletedAt: null,
      },
      _count: true,
    });

    // Get total
    const totalInquiries = await this.prisma.inquiry.count({
      where: { customerId, deletedAt: null },
    });

    // Calculate stats
    const activeStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'QUOTING', 'SAMPLE', 'TESTING', 'NEGOTIATION'];
    const completedStatuses = ['WON', 'LOST'];

    const active = inquiryStats
      .filter(s => activeStatuses.includes(s.status))
      .reduce((sum, s) => sum + s._count, 0);

    const completed = inquiryStats
      .filter(s => completedStatuses.includes(s.status))
      .reduce((sum, s) => sum + s._count, 0);

    // Get recent inquiries
    const recentInquiries = await this.prisma.inquiry.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        inquiryNumber: true,
        status: true,
        productName: true,
        createdAt: true,
      },
    });

    // Get recent downloads
    const recentDownloads = await this.prisma.documentDownload.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        document: {
          select: { name: true, nameEn: true },
        },
      },
    });

    return {
      inquiryStats: {
        total: totalInquiries,
        active,
        completed,
      },
      recentInquiries,
      recentDownloads,
    };
  }
}
