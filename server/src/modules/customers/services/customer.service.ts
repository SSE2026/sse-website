import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Customer, LeadSource, Prisma } from '@prisma/client';

/**
 * DTO for customer creation from inquiry
 */
export interface CreateCustomerFromInquiryDto {
  email: string;
  customerName: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  countryCode?: string;
  companyName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  referrer?: string;
}

/**
 * Customer Service
 * Handles customer creation and lookup with proper concurrency safety
 */
@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find or create customer based on email
   * Uses database unique constraint for concurrency safety
   */
  async findOrCreate(dto: CreateCustomerFromInquiryDto): Promise<Customer> {
    // First try to find existing customer by email
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });

    if (existingCustomer) {
      // Customer exists - update lastActivityAt only
      const updated = await this.prisma.customer.update({
        where: { id: existingCustomer.id },
        data: { lastActivityAt: new Date() },
      });

      this.logger.debug(`Reused existing customer: ${existingCustomer.email}`);
      return updated;
    }

    // Customer doesn't exist - create new one
    // Note: We don't auto-create Company here
    // Company matching will be done at admin discretion
    const customer = await this.prisma.customer.create({
      data: {
        email: dto.email,
        name: dto.customerName,
        phone: dto.phone || null,
        whatsapp: dto.whatsapp || null,
        country: dto.country || null,
        countryCode: dto.countryCode || null,
        source: this.mapUtmSource(dto),
        utmSource: dto.utmSource || null,
        utmMedium: dto.utmMedium || null,
        utmCampaign: dto.utmCampaign || null,
        landingPage: dto.landingPage || null,
        referrer: dto.referrer || null,
      },
    });

    this.logger.debug(`Created new customer: ${customer.email}`);
    return customer;
  }

  /**
   * Find or create customer within an existing transaction
   */
  async findOrCreateWithTx(
    tx: Prisma.TransactionClient,
    dto: CreateCustomerFromInquiryDto,
  ): Promise<Customer> {
    // First try to find existing customer by email
    const existingCustomer = await tx.customer.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });

    if (existingCustomer) {
      // Customer exists - update lastActivityAt only
      const updated = await tx.customer.update({
        where: { id: existingCustomer.id },
        data: { lastActivityAt: new Date() },
      });

      this.logger.debug(`[Tx] Reused existing customer: ${existingCustomer.email}`);
      return updated;
    }

    // Customer doesn't exist - create new one
    const customer = await tx.customer.create({
      data: {
        email: dto.email,
        name: dto.customerName,
        phone: dto.phone || null,
        whatsapp: dto.whatsapp || null,
        country: dto.country || null,
        countryCode: dto.countryCode || null,
        source: this.mapUtmSource(dto),
        utmSource: dto.utmSource || null,
        utmMedium: dto.utmMedium || null,
        utmCampaign: dto.utmCampaign || null,
        landingPage: dto.landingPage || null,
        referrer: dto.referrer || null,
      },
    });

    this.logger.debug(`[Tx] Created new customer: ${customer.email}`);
    return customer;
  }

  /**
   * Find customer by ID
   */
  async findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  /**
   * Find customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  /**
   * List customers with pagination
   */
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
  }): Promise<{ items: Customer[]; total: number }> {
    const { page = 1, limit = 20, search, country } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(country && { country }),
    };

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Map UTM parameters to LeadSource enum
   */
  private mapUtmSource(dto: CreateCustomerFromInquiryDto): LeadSource {
    if (dto.utmSource === 'google') {
      return dto.utmMedium === 'cpc' ? 'GOOGLE_ADS' : 'GOOGLE_ORGANIC';
    }
    if (dto.utmSource === 'linkedin') return 'LINKEDIN';
    if (dto.utmMedium === 'referral') return 'REFERRAL';
    return 'DIRECT';
  }
}
