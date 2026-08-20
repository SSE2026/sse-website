import { Inquiry, LeadActivity } from '@prisma/client';

/**
 * Invitation email data
 */
export interface InvitationEmailData {
  email: string;
  customerName: string;
  inviterName: string;
  invitationUrl: string;
  expiresAt: Date;
}

/**
 * Email Service Interface
 * Abstracts email sending to support multiple providers
 */
export interface EmailService {
  /**
   * Send notification to sales team when new RFQ is received
   */
  sendInquiryNotification(inquiry: Inquiry): Promise<void>;

  /**
   * Send confirmation email to customer
   */
  sendCustomerConfirmation(inquiry: Inquiry): Promise<void>;

  /**
   * Send portal invitation email to invitee
   */
  sendPortalInvitation(data: InvitationEmailData): Promise<void>;
}

/**
 * Email Service Token for DI
 */
export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');
