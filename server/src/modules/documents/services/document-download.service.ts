import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DownloadDocumentDto } from '../dto/download-document.dto';
import { LeadSource } from '@prisma/client';

/**
 * Document Download Service
 * Handles lead capture for document downloads
 */
@Injectable()
export class DocumentDownloadService {
  private readonly logger = new Logger(DocumentDownloadService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Process document download with lead capture
   */
  async processDownload(documentId: string, dto: DownloadDocumentDto): Promise<{
    downloadUrl: string;
    documentName: string;
    customerId?: string;
  }> {
    // 1. Verify document exists and is published
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        products: { select: { product: { select: { name: true, model: true } } } },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (!document.published) {
      throw new NotFoundException('Document not available');
    }

    if (!document.fileUrl) {
      throw new BadRequestException('Document file not available');
    }

    // 2. Check if lead capture is required
    if (document.leadRequired && !dto.email) {
      throw new BadRequestException('Email is required to download this document');
    }

    // 3. Find or create customer
    let customerId: string | undefined;
    if (dto.email) {
      const customer = await this.findOrCreateCustomer(dto);
      customerId = customer.id;
    }

    // 4. Create download record
    await this.prisma.documentDownload.create({
      data: {
        documentId: document.id,
        customerId: customerId,
        email: dto.email,
        name: dto.name || null,
        company: dto.company || null,
        country: dto.country || null,
        source: LeadSource.DATASHEET,
      },
    });

    // 5. Increment download count
    await this.prisma.document.update({
      where: { id: documentId },
      data: { downloadCount: { increment: 1 } },
    });

    this.logger.log(`Document downloaded: ${documentId}, email: ${dto.email}`);

    return {
      downloadUrl: document.fileUrl,
      documentName: document.name,
      customerId,
    };
  }

  /**
   * Find existing customer or create new one
   * Does NOT overwrite existing customer data
   */
  private async findOrCreateCustomer(dto: DownloadDocumentDto): Promise<{
    id: string;
    email: string;
    name: string;
    country: string | null;
  }> {
    // Find existing customer by email
    const existing = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      this.logger.log(`Reusing existing customer: ${existing.id}`);
      return existing;
    }

    // Create new customer
    // Note: We don't auto-create Company - Company remains null
    const customer = await this.prisma.customer.create({
      data: {
        email: dto.email,
        name: dto.name || 'Unknown',
        country: dto.country || null,
        source: LeadSource.DATASHEET,
        // Do NOT set companyId - Company must be created separately
      },
    });

    this.logger.log(`Created new customer: ${customer.id} for email: ${dto.email}`);

    return customer;
  }

  /**
   * Get download analytics for a document
   */
  async getDownloadAnalytics(documentId: string): Promise<{
    totalDownloads: number;
    uniqueEmails: number;
    recentDownloads: Array<{
      email: string;
      name: string | null;
      company: string | null;
      createdAt: Date;
    }>;
  }> {
    const downloads = await this.prisma.documentDownload.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const uniqueEmails = new Set(downloads.map((d) => d.email)).size;

    return {
      totalDownloads: downloads.length,
      uniqueEmails,
      recentDownloads: downloads.map((d) => ({
        email: d.email,
        name: d.name,
        company: d.company,
        createdAt: d.createdAt,
      })),
    };
  }
}
