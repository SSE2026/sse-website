import {
  Injectable,
  Logger,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PortalStatus, ActivityType, User, Customer } from '@prisma/client';

/**
 * Account Linking Service
 * Handles admin operations for linking/unlinking users to customers
 */
@Injectable()
export class AccountLinkingService {
  private readonly logger = new Logger(AccountLinkingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Link an existing user to a customer
   */
  async linkUserToCustomer(
    userId: string,
    customerId: string,
    adminId: string,
    adminName: string,
  ): Promise<User> {
    // 1. Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Verify user is not already linked
    if (user.customerId) {
      throw new ConflictException('User is already linked to a customer');
    }

    // 3. Verify customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // 4. Verify customer is active
    if (customer.deletedAt || !customer.isActive) {
      throw new BadRequestException('Cannot link to an inactive or deleted customer');
    }

    // 5. Verify customer is not already linked
    const existingLinkedUser = await this.prisma.user.findFirst({
      where: { customerId },
    });

    if (existingLinkedUser) {
      throw new ConflictException('Customer already has a linked user');
    }

    // 6. Perform linking atomically
    const updatedUser = await this.prisma.$transaction(async (tx) => {
      // Update user
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          customerId,
          portalStatus: PortalStatus.ACTIVE,
        },
      });

      // Create audit log
      await tx.leadActivity.create({
        data: {
          inquiryId: '',
          customerId,
          type: ActivityType.OTHER,
          title: 'Portal User Linked',
          content: `User ${user.email} linked to customer ${customer.name} by ${adminName}`,
          createdById: adminId,
          createdByName: adminName,
          relatedType: 'USER_LINK',
          relatedId: userId,
        },
      });

      return updated;
    });

    this.logger.log(`User ${userId} linked to customer ${customerId} by ${adminId}`);

    return updatedUser;
  }

  /**
   * Unlink a user from their customer
   */
  async unlinkUserFromCustomer(
    userId: string,
    reason: string,
    adminId: string,
    adminName: string,
  ): Promise<User> {
    // 1. Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { customer: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Verify user is linked
    if (!user.customerId) {
      throw new BadRequestException('User is not linked to any customer');
    }

    const customerId = user.customerId;

    // 3. Perform unlinking atomically
    const updatedUser = await this.prisma.$transaction(async (tx) => {
      // Update user
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          customerId: null,
          portalStatus: PortalStatus.NONE,
        },
      });

      // Create audit log
      await tx.leadActivity.create({
        data: {
          inquiryId: '',
          customerId,
          type: ActivityType.OTHER,
          title: 'Portal User Unlinked',
          content: `User ${user.email} unlinked from customer ${user.customer?.name || customerId}. Reason: ${reason}`,
          createdById: adminId,
          createdByName: adminName,
          relatedType: 'USER_UNLINK',
          relatedId: userId,
        },
      });

      return updated;
    });

    this.logger.log(`User ${userId} unlinked from customer ${customerId} by ${adminId}`);

    return updatedUser;
  }

  /**
   * Disable a portal user
   */
  async disableUser(
    userId: string,
    reason: string,
    adminId: string,
    adminName: string,
  ): Promise<User> {
    // 1. Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Verify user has portal access
    if (user.portalStatus === PortalStatus.NONE) {
      throw new BadRequestException('User does not have portal access');
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      // Disable user
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          portalStatus: PortalStatus.DISABLED,
        },
      });

      // Create audit log
      await tx.leadActivity.create({
        data: {
          inquiryId: '',
          customerId: user.customerId || '',
          type: ActivityType.OTHER,
          title: 'Portal User Disabled',
          content: `User ${user.email} disabled. Reason: ${reason}`,
          createdById: adminId,
          createdByName: adminName,
          relatedType: 'USER_DISABLE',
          relatedId: userId,
        },
      });

      return updated;
    });

    this.logger.log(`User ${userId} disabled by ${adminId}`);

    return updatedUser;
  }

  /**
   * Enable a portal user
   */
  async enableUser(
    userId: string,
    adminId: string,
    adminName: string,
  ): Promise<User> {
    // 1. Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Verify user is actually disabled
    if (user.portalStatus !== PortalStatus.DISABLED) {
      throw new BadRequestException('User is not disabled');
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      // Enable user
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          isActive: true,
          portalStatus: PortalStatus.ACTIVE,
        },
      });

      // Create audit log
      await tx.leadActivity.create({
        data: {
          inquiryId: '',
          customerId: user.customerId || '',
          type: ActivityType.OTHER,
          title: 'Portal User Enabled',
          content: `User ${user.email} enabled`,
          createdById: adminId,
          createdByName: adminName,
          relatedType: 'USER_ENABLE',
          relatedId: userId,
        },
      });

      return updated;
    });

    this.logger.log(`User ${userId} enabled by ${adminId}`);

    return updatedUser;
  }

  /**
   * Get customer portal status
   */
  async getCustomerPortalStatus(customerId: string) {
    // Verify customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
            portalStatus: true,
            createdAt: true,
          },
        },
        invitations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            email: true,
            status: true,
            expiresAt: true,
            createdAt: true,
            acceptedAt: true,
            invitedByName: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        isActive: customer.isActive,
      },
      linkedUser: customer.user,
      recentInvitations: customer.invitations,
      hasPortalAccess: !!customer.user,
    };
  }

  /**
   * Get user portal details
   */
  async getUserPortalDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
        invitations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            email: true,
            status: true,
            expiresAt: true,
            createdAt: true,
            acceptedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        portalStatus: user.portalStatus,
      },
      linkedCustomer: user.customer,
      invitations: user.invitations,
    };
  }
}
