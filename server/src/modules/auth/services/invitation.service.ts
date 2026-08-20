import {
  Injectable,
  Logger,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  PortalInvitation,
  InvitationStatus,
  PortalStatus,
  ActivityType,
} from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService, InvitationEmailData } from '../../email/interfaces/email-service.interface';

/**
 * DTOs for Invitation Service
 */
export interface CreateInvitationDto {
  email: string;
  name?: string;
  customerId: string;
  invitedById: string;
  invitedByName: string;
  sendEmail?: boolean;
}

export interface AcceptInvitationDto {
  password: string;
  name?: string;
}

export interface InvitationResult {
  invitation: PortalInvitation;
  user?: {
    id: string;
    email: string;
    name: string;
    portalStatus: PortalStatus;
  };
  email?: string;
  rawToken?: string;
}

export interface AcceptResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
}

/**
 * Invitation Service
 * Handles portal invitation lifecycle
 */
@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);
  private readonly TOKEN_BYTES = 32; // 256 bits
  private readonly INVITATION_EXPIRY_DAYS = 7;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create a new portal invitation
   */
  async createInvitation(dto: CreateInvitationDto): Promise<InvitationResult> {
    const { email, name, customerId, invitedById, invitedByName, sendEmail = true } = dto;

    // 1. Validate customer exists and is active
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.deletedAt || !customer.isActive) {
      throw new BadRequestException('Cannot invite to an inactive or deleted customer');
    }

    // 2. Check if customer already has a linked user
    const existingUserWithCustomer = await this.prisma.user.findFirst({
      where: { customerId },
    });

    if (existingUserWithCustomer) {
      throw new ConflictException('This customer already has a linked portal user');
    }

    // 3. Check for existing active invitation for this customer
    const existingActiveInvitation = await this.prisma.portalInvitation.findFirst({
      where: {
        customerId,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingActiveInvitation) {
      throw new ConflictException('An active invitation already exists for this customer');
    }

    // 4. Generate secure token
    const rawToken = this.generateSecureToken();
    const tokenHash = await this.hashToken(rawToken);
    const expiresAt = this.calculateExpiry();

    // 5. Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    let resultInvitation: PortalInvitation;
    let resultUser: { id: string; email: string; name: string; portalStatus: PortalStatus } | undefined;

    // 6. Create invitation and optionally create user in transaction
    if (existingUser) {
      // Link existing user
      if (existingUser.customerId) {
        throw new ConflictException('This user is already linked to another customer');
      }

      // Create invitation for existing user
      resultInvitation = await this.prisma.$transaction(async (tx) => {
        const invitation = await tx.portalInvitation.create({
          data: {
            email: email.toLowerCase(),
            userId: existingUser.id,
            customerId,
            tokenHash,
            expiresAt,
            status: InvitationStatus.PENDING,
            invitedById,
            invitedByName,
          },
        });

        // Update user status to invited
        await tx.user.update({
          where: { id: existingUser.id },
          data: { portalStatus: PortalStatus.INVITED },
        });

        // Create audit log
        await tx.leadActivity.create({
          data: {
            inquiryId: '',
            customerId,
            type: ActivityType.OTHER,
            title: 'Portal Invitation Created',
            content: `Invitation sent to ${email} for customer ${customer.name}`,
            createdById: invitedById,
            createdByName: invitedByName,
            relatedType: 'INVITATION',
            relatedId: invitation.id,
          },
        });

        return invitation;
      });

      resultUser = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        portalStatus: PortalStatus.INVITED,
      };
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(rawToken, 10);
      const userName = name || email.split('@')[0];

      resultInvitation = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            name: userName,
            password: hashedPassword,
            role: 'USER',
            isActive: false,
            portalStatus: PortalStatus.INVITED,
            customerId,
          },
        });

        const invitation = await tx.portalInvitation.create({
          data: {
            email: email.toLowerCase(),
            userId: user.id,
            customerId,
            tokenHash,
            expiresAt,
            status: InvitationStatus.PENDING,
            invitedById,
            invitedByName,
          },
        });

        // Create audit log
        await tx.leadActivity.create({
          data: {
            inquiryId: '',
            customerId,
            type: ActivityType.OTHER,
            title: 'Portal Invitation Created',
            content: `Invitation sent to ${email} for customer ${customer.name}`,
            createdById: invitedById,
            createdByName: invitedByName,
            relatedType: 'INVITATION',
            relatedId: invitation.id,
          },
        });

        return invitation;
      });

      resultUser = {
        id: resultInvitation.userId!,
        email: email.toLowerCase(),
        name: userName,
        portalStatus: PortalStatus.INVITED,
      };
    }

    // 7. Send invitation email (outside transaction)
    if (sendEmail) {
      const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invitation/accept?token=${rawToken}`;
      const emailData: InvitationEmailData = {
        email,
        customerName: customer.name,
        inviterName: invitedByName,
        invitationUrl,
        expiresAt,
      };

      try {
        await this.emailService.sendPortalInvitation(emailData);
      } catch (err) {
        this.logger.error(`Failed to send invitation email: ${(err as Error).message}`);
        // Don't fail the invitation if email fails
      }
    }

    this.logger.log(`Invitation created for ${email}, customer: ${customerId}`);

    return {
      invitation: resultInvitation,
      user: resultUser,
      email,
      rawToken: sendEmail ? undefined : rawToken,
    };
  }

  /**
   * Accept an invitation with token and password
   */
  async acceptInvitation(rawToken: string, dto: AcceptInvitationDto): Promise<AcceptResult> {
    const tokenHash = await this.hashToken(rawToken);

    // 1. Find invitation by token hash
    const invitation = await this.prisma.portalInvitation.findUnique({
      where: { tokenHash },
      include: {
        customer: true,
        user: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invalid invitation');
    }

    // 2. Check invitation status
    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new BadRequestException('This invitation has already been used');
    }

    if (invitation.status === InvitationStatus.EXPIRED) {
      throw new BadRequestException('This invitation has expired');
    }

    if (invitation.status === InvitationStatus.REVOKED) {
      throw new BadRequestException('This invitation has been revoked');
    }

    // 3. Check expiration
    if (invitation.expiresAt < new Date()) {
      // Update status to expired
      await this.prisma.portalInvitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new BadRequestException('This invitation has expired');
    }

    // 4. Check customer is still active
    if (invitation.customer.deletedAt || !invitation.customer.isActive) {
      throw new BadRequestException('The customer is no longer active');
    }

    if (!invitation.user) {
      throw new BadRequestException('Invitation user not found');
    }

    // 5. Update user with password and activate
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: invitation.user!.id },
        data: {
          password: hashedPassword,
          name: dto.name || invitation.user!.name,
          isActive: true,
          portalStatus: PortalStatus.ACTIVE,
        },
      });

      // Mark invitation as accepted
      await tx.portalInvitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });

      // Create audit log
      await tx.leadActivity.create({
        data: {
          inquiryId: '',
          customerId: invitation.customerId,
          type: ActivityType.OTHER,
          title: 'Portal Invitation Accepted',
          content: `User ${user.email} accepted invitation`,
          createdById: user.id,
          createdByName: user.name,
          relatedType: 'INVITATION',
          relatedId: invitation.id,
        },
      });

      return user;
    });

    this.logger.log(`Invitation accepted: ${updatedUser.email}`);

    // 6. Generate JWT token
    const accessToken = this.jwtService.sign({
      sub: updatedUser.id,
      role: updatedUser.role,
    });

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
      accessToken,
    };
  }

  /**
   * Get invitation by token (for validation display)
   */
  async getInvitationByToken(rawToken: string) {
    const tokenHash = await this.hashToken(rawToken);

    const invitation = await this.prisma.portalInvitation.findUnique({
      where: { tokenHash },
      include: {
        customer: { select: { id: true, name: true } },
        user: { select: { email: true, name: true } },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invalid invitation');
    }

    // Check if expired
    const isExpired = invitation.expiresAt < new Date();
    let status = invitation.status;
    if (invitation.status === InvitationStatus.PENDING && isExpired) {
      status = InvitationStatus.EXPIRED;
    }

    return {
      email: invitation.email,
      customerName: invitation.customer.name,
      expiresAt: invitation.expiresAt,
      status,
      isExpired,
    };
  }

  /**
   * Resend invitation (revoke old, create new)
   */
  async resendInvitation(invitationId: string, invitedById: string, invitedByName: string): Promise<InvitationResult> {
    const oldInvitation = await this.prisma.portalInvitation.findUnique({
      where: { id: invitationId },
      include: { customer: true },
    });

    if (!oldInvitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (oldInvitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Can only resend pending invitations');
    }

    // Revoke old invitation
    await this.prisma.portalInvitation.update({
      where: { id: invitationId },
      data: {
        status: InvitationStatus.REVOKED,
        revokedAt: new Date(),
        revokedReason: 'Resent',
      },
    });

    // Create new invitation
    return this.createInvitation({
      email: oldInvitation.email,
      customerId: oldInvitation.customerId,
      invitedById,
      invitedByName,
      sendEmail: true,
    });
  }

  /**
   * Revoke invitation
   */
  async revokeInvitation(invitationId: string, reason: string, revokedById: string, revokedByName: string) {
    const invitation = await this.prisma.portalInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Can only revoke pending invitations');
    }

    // Update invitation
    await this.prisma.$transaction(async (tx) => {
      await tx.portalInvitation.update({
        where: { id: invitationId },
        data: {
          status: InvitationStatus.REVOKED,
          revokedAt: new Date(),
          revokedReason: reason,
        },
      });

      // If user was created, deactivate it
      if (invitation.userId) {
        await tx.user.update({
          where: { id: invitation.userId },
          data: {
            isActive: false,
            portalStatus: PortalStatus.NONE,
            customerId: null,
          },
        });
      }

      // Create audit log
      await tx.leadActivity.create({
        data: {
          inquiryId: '',
          customerId: invitation.customerId,
          type: ActivityType.OTHER,
          title: 'Portal Invitation Revoked',
          content: `Invitation for ${invitation.email} revoked: ${reason}`,
          createdById: revokedById,
          createdByName: revokedByName,
          relatedType: 'INVITATION',
          relatedId: invitation.id,
        },
      });
    });

    this.logger.log(`Invitation revoked: ${invitationId}`);
  }

  /**
   * Get invitations for a customer
   */
  async getCustomerInvitations(customerId: string) {
    return this.prisma.portalInvitation.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        status: true,
        expiresAt: true,
        createdAt: true,
        acceptedAt: true,
        revokedAt: true,
        revokedReason: true,
        invitedByName: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            portalStatus: true,
          },
        },
      },
    });
  }

  /**
   * Generate cryptographically secure token
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(this.TOKEN_BYTES).toString('hex');
  }

  /**
   * Hash token with bcrypt
   */
  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  /**
   * Calculate invitation expiry date
   */
  private calculateExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.INVITATION_EXPIRY_DAYS);
    return expiry;
  }
}
