import { Injectable, Logger } from '@nestjs/common';
import { Inquiry } from '@prisma/client';
import { EmailService, InvitationEmailData } from '../interfaces/email-service.interface';

/**
 * Mock Email Service for Development
 * Logs emails to console instead of sending
 */
@Injectable()
export class MockEmailService implements EmailService {
  private readonly logger = new Logger(MockEmailService.name);

  async sendInquiryNotification(inquiry: Inquiry): Promise<void> {
    this.logger.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                         [MOCK EMAIL - SALES]                          ║
╠══════════════════════════════════════════════════════════════════════╣
║ To:      sales@shensafu.com                                           ║
║ Subject: [RFQ ${inquiry.inquiryNumber}] ${inquiry.customerName || 'N/A'} - ${inquiry.inquiryType}
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║ Inquiry Number: ${inquiry.inquiryNumber}                                      ║
║ Type:           ${inquiry.inquiryType}                                        ║
║ Status:         ${inquiry.status}                                             ║
║                                                                      ║
║ ──────────────────────── Customer Info ─────────────────────────────║
║ Name:           ${inquiry.customerName || 'N/A'}                                    ║
║ Company:        ${inquiry.companyName || 'N/A'}                                     ║
║ Email:          ${inquiry.email}                                              ║
║ Phone:          ${inquiry.phone || 'N/A'}                                            ║
║ Country:        ${inquiry.country || 'N/A'}                                           ║
║                                                                      ║
║ ──────────────────────── Product Interest ──────────────────────────║
║ Product:        ${inquiry.productName || 'N/A'}                                     ║
║ Model:          ${inquiry.productModel || 'N/A'}                                       ║
║ Quantity:       ${inquiry.quantity || 'N/A'}                                            ║
║                                                                      ║
║ ──────────────────────── Technical Specs ───────────────────────────║
║ Voltage:        ${inquiry.voltageSnapshot || 'N/A'}                                           ║
║ Capacity:       ${inquiry.capacitySnapshot || 'N/A'}                                          ║
║ Energy:         ${inquiry.energySnapshot || 'N/A'}                                           ║
║                                                                      ║
║ ──────────────────────── Customer Message ──────────────────────────║
║ ${(inquiry.message || 'No message').substring(0, 60).padEnd(62)}║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
    `);
  }

  async sendCustomerConfirmation(inquiry: Inquiry): Promise<void> {
    this.logger.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                      [MOCK EMAIL - CUSTOMER]                         ║
╠══════════════════════════════════════════════════════════════════════╣
║ To:      ${inquiry.email.padEnd(58)}║
║ Subject: Thank you for your inquiry - ${inquiry.inquiryNumber}
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║ Dear ${(inquiry.customerName || 'Valued Customer').padEnd(53)}║
║                                                                      ║
║ Thank you for your inquiry. Our team will review your requirements   ║
║ and respond within 24-48 hours.                                      ║
║                                                                      ║
║ Your Inquiry Number: ${inquiry.inquiryNumber.padEnd(41)}║
║                                                                      ║
║ Best regards,                                                       ║
║ Swift Safe Energy Team                                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
    `);
  }

  async sendPortalInvitation(data: InvitationEmailData): Promise<void> {
    const expiresStr = data.expiresAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.logger.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                   [MOCK EMAIL - PORTAL INVITATION]                 ║
╠══════════════════════════════════════════════════════════════════════╣
║ To:      ${data.email.padEnd(58)}║
║ Subject: You've been invited to Swift Safe Energy Customer Portal
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║ Dear Valued Customer,                                              ║
║                                                                      ║
║ You have been invited to access the Customer Portal for           ║
║ ${data.customerName.padEnd(56)}║
║                                                                      ║
║ Invited by: ${data.inviterName.padEnd(51)}║
║                                                                      ║
║ Click the link below to accept your invitation:                    ║
║ ${data.invitationUrl.substring(0, 62).padEnd(62)}║
║                                                                      ║
║ This invitation expires on: ${expiresStr.padEnd(42)}║
║                                                                      ║
║ Best regards,                                                       ║
║ Swift Safe Energy Team                                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
    `);
  }
}
