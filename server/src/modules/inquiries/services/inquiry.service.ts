import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { InquiryNumberService } from './inquiry-number.service';
import { SnapshotService } from './snapshot.service';
import { LeadActivityService } from './lead-activity.service';
import { CustomerService, CreateCustomerFromInquiryDto } from '../../customers/services/customer.service';
import { LocalStorageService } from '../../storage/services/local-storage.service';
import { FileValidationService } from '../../storage/services/file-validation.service';
import { EmailService, EMAIL_SERVICE } from '../../email/interfaces/email-service.interface';
import { StatusTransitionValidator } from '../validators/status-transition.validator';
import {
  CreateInquiryDto,
  QueryInquiryDto,
  UpdateInquiryStatusDto,
  UpdateInquiryDto,
  AddActivityDto,
} from '../dto';
import { Inquiry, InquiryStatus, ActivityType, Prisma } from '@prisma/client';

/**
 * File type for uploads
 */

/**
 * JWT Payload type for current user
 */
interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Inquiry Service - Core business logic
 */
@Injectable()
export class InquiryService {
  private readonly logger = new Logger(InquiryService.name);
  private readonly fileValidation: FileValidationService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly inquiryNumberService: InquiryNumberService,
    private readonly snapshotService: SnapshotService,
    private readonly leadActivityService: LeadActivityService,
    private readonly customerService: CustomerService,
    private readonly storageService: LocalStorageService,
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {
    this.fileValidation = new FileValidationService();
  }

  /**
   * Create a new inquiry (public endpoint)
   * Full transaction with email sent after commit
   */
  async create(dto: CreateInquiryDto, files?: any[]): Promise<Inquiry> {
    // 1. Validate files if provided
    if (files?.length) {
      for (const file of files) {
        this.fileValidation.validate(file);
      }
      this.fileValidation.validateTotalSize(files);
    }

    // 2. Execute transaction
    const inquiry = await this.prisma.$transaction(async (tx) => {
      // 2.1 Find or create customer
      const customerDto: CreateCustomerFromInquiryDto = {
        email: dto.email,
        customerName: dto.customerName,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        country: dto.country,
        countryCode: dto.countryCode,
        companyName: dto.companyName,
        utmSource: dto.utmSource,
        utmMedium: dto.utmMedium,
        utmCampaign: dto.utmCampaign,
        landingPage: dto.landingPage,
        referrer: dto.referrer,
      };
      const customer = await this.customerService.findOrCreateWithTx(tx, customerDto);

      // 2.2 Generate inquiry number
      const inquiryNumber = await this.inquiryNumberService.generateWithTx(tx);

      // 2.3 Generate snapshot based on inquiry type
      const snapshot = await this.snapshotService.generate(dto);

      // 2.4 Upload attachments if any
      const attachments = files?.length ? await this.uploadAttachments(tx, files) : [];

      // 2.5 Create inquiry
      const inquiry = await tx.inquiry.create({
        data: {
          inquiryNumber,
          inquiryType: dto.inquiryType,
          customerId: customer.id,
          companyId: customer.companyId,
          email: dto.email,
          customerName: dto.customerName,
          companyName: dto.companyName || null,
          phone: dto.phone || null,
          whatsapp: dto.whatsapp || null,
          country: dto.country || null,
          countryCode: dto.countryCode || null,
          applicationId: dto.applicationId || null,
          applicationName: dto.applicationName || null,
          // Product snapshot
          productId: snapshot.productId,
          productName: snapshot.productName,
          productModel: snapshot.productModel,
          productVariantId: snapshot.productVariantId,
          variantName: snapshot.variantName,
          variantSku: snapshot.variantSku,
          voltageSnapshot: snapshot.voltageSnapshot,
          capacitySnapshot: snapshot.capacitySnapshot,
          energySnapshot: snapshot.energySnapshot,
          energyDensitySnapshot: snapshot.energyDensitySnapshot,
          weightSnapshot: snapshot.weightSnapshot,
          dimensionsSnapshot: snapshot.dimensionsSnapshot,
          chargeRateSnapshot: snapshot.chargeRateSnapshot,
          dischargeRateSnapshot: snapshot.dischargeRateSnapshot,
          cycleLifeSnapshot: snapshot.cycleLifeSnapshot,
          specificationsSnapshot: snapshot.specificationsSnapshot,
          // Business terms
          quantity: dto.quantity || null,
          quantityUnit: dto.quantityUnit || null,
          targetPrice: dto.targetPrice || null,
          expectedDelivery: dto.expectedDelivery || null,
          destinationCountry: dto.destinationCountry || null,
          // Message
          message: dto.message || null,
          // UTM
          utmSource: dto.utmSource || null,
          utmMedium: dto.utmMedium || null,
          utmCampaign: dto.utmCampaign || null,
          utmTerm: dto.utmTerm || null,
          utmContent: dto.utmContent || null,
          landingPage: dto.landingPage || null,
          referrer: dto.referrer || null,
          // Status
          status: InquiryStatus.NEW,
          source: customer.source,
        },
      });

      // 2.6 Create initial STATUS_CHANGE activity
      await this.leadActivityService.createStatusChange(
        inquiry.id,
        null,
        InquiryStatus.NEW,
        null,
        'System',
        tx,
      );

      // 2.7 Update customer lastActivityAt
      await tx.customer.update({
        where: { id: customer.id },
        data: { lastActivityAt: new Date() },
      });

      this.logger.log(`Created inquiry ${inquiryNumber} for ${dto.email}`);
      return inquiry;
    }, { timeout: 15000 });

    // 3. Send emails (outside transaction - won't affect inquiry creation)
    this.sendEmailsAsync(inquiry);

    return inquiry;
  }

  /**
   * Update inquiry status with validation
   */
  async updateStatus(
    id: string,
    dto: UpdateInquiryStatusDto,
    user: JwtPayload,
  ): Promise<Inquiry> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Inquiry not found',
      });
    }

    // Validate status transition
    const validator = new StatusTransitionValidator();
    validator.validate(inquiry.status, dto.status);

    // Execute in transaction
    const updated = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.inquiry.update({
        where: { id },
        data: { status: dto.status },
      });

      // Create STATUS_CHANGE activity
      await this.leadActivityService.createStatusChange(
        id,
        inquiry.status,
        dto.status,
        user.userId,
        user.name,
        tx,
      );

      // If note provided, also create a NOTE activity
      if (dto.note) {
        await this.leadActivityService.createActivity(
          id,
          inquiry.customerId,
          ActivityType.NOTE,
          'Status update note',
          dto.note,
          user.userId,
          user.name,
          tx,
        );
      }

      return updated;
    });

    this.logger.log(`Updated inquiry ${inquiry.inquiryNumber} status: ${inquiry.status} → ${dto.status}`);
    return updated;
  }

  /**
   * Update inquiry general info
   */
  async update(id: string, dto: UpdateInquiryDto): Promise<Inquiry> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Inquiry not found',
      });
    }

    return this.prisma.inquiry.update({
      where: { id },
      data: {
        ...(dto.customerName && { customerName: dto.customerName }),
        ...(dto.companyName && { companyName: dto.companyName }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.whatsapp && { whatsapp: dto.whatsapp }),
        ...(dto.country && { country: dto.country }),
        ...(dto.status && { status: dto.status }),
        ...(dto.assignedTo && { assignedTo: dto.assignedTo }),
        ...(dto.quantity && { quantity: dto.quantity }),
        ...(dto.targetPrice && { targetPrice: dto.targetPrice }),
        ...(dto.internalNotes && { internalNotes: dto.internalNotes }),
      },
    });
  }

  /**
   * Add activity to inquiry
   */
  async addActivity(
    id: string,
    dto: AddActivityDto,
    user: JwtPayload,
  ): Promise<any> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Inquiry not found',
      });
    }

    const activity = await this.leadActivityService.createActivity(
      id,
      inquiry.customerId,
      dto.type,
      dto.title,
      dto.content,
      user.userId,
      user.name,
    );

    return activity;
  }

  /**
   * Get inquiry by ID with activities
   */
  async findOne(id: string): Promise<any> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
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

    if (!inquiry) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Inquiry not found',
      });
    }

    return inquiry;
  }

  /**
   * List inquiries with filters (admin)
   */
  async findAll(query: QueryInquiryDto): Promise<{ items: any[]; total: number; meta: any }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    // Build date filters first
    const dateFilter: any = {};
    if (query.dateFrom) {
      dateFilter.gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      dateFilter.lte = new Date(query.dateTo);
    }

    const where: any = {
      deletedAt: null,
      ...(query.status && { status: query.status }),
      ...(query.inquiryType && { inquiryType: query.inquiryType }),
      ...(query.country && { country: query.country }),
      ...(query.productId && { productId: query.productId }),
      ...(query.customerId && { customerId: query.customerId }),
      ...(query.companyId && { companyId: query.companyId }),
      ...(query.source && { source: query.source }),
      ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
    };

    // Search filter
    if (query.search) {
      where.OR = [
        { inquiryNumber: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, email: true } },
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
   * Get activities for inquiry
   */
  async getActivities(id: string): Promise<{ items: any[]; total: number }> {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Inquiry not found',
      });
    }

    return this.leadActivityService.getByInquiry(id);
  }

  /**
   * Upload attachments within transaction
   */
  private async uploadAttachments(tx: any, files: any[]): Promise<any[]> {
    const results = [];

    for (const file of files) {
      const uploaded = await this.storageService.upload(file, 'inquiries');
      const attachment = await tx.inquiryAttachment.create({
        data: {
          inquiryId: '', // Will be set after inquiry creation
          fileName: uploaded.originalName,
          fileUrl: uploaded.url,
          fileSize: uploaded.size,
          mimeType: uploaded.mimeType,
          type: 'OTHER',
        },
      });
      results.push({ ...attachment, tempUrl: uploaded.url });
    }

    return results;
  }

  /**
   * Send emails asynchronously (after transaction commit)
   * If email fails, it won't affect the inquiry creation
   */
  private sendEmailsAsync(inquiry: Inquiry): void {
    // Fire and forget - don't await
    this.emailService.sendInquiryNotification(inquiry).catch((error) => {
      this.logger.error(`Failed to send inquiry notification email: ${error.message}`);
    });

    this.emailService.sendCustomerConfirmation(inquiry).catch((error) => {
      this.logger.error(`Failed to send customer confirmation email: ${error.message}`);
    });
  }
}
