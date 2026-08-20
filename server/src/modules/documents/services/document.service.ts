import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto, QueryDocumentDto, buildDocumentWhere } from '../dto';
import { DocumentType, DocumentStatus, Prisma } from '@prisma/client';

/**
 * Document Service
 * Handles CRUD operations for documents with lifecycle management
 */
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new document in DRAFT status (no file required)
   */
  async create(dto: CreateDocumentDto): Promise<{
    id: string;
    name: string;
    type: DocumentType;
    status: DocumentStatus;
    fileUrl: string | null;
    published: boolean;
    createdAt: Date;
  }> {
    const document = await this.prisma.document.create({
      data: {
        name: dto.name,
        nameEn: dto.nameEn,
        type: dto.type,
        language: dto.language || 'en',
        version: dto.version,
        pages: dto.pages,
        leadRequired: dto.leadRequired ?? true,
        isPublic: dto.isPublic ?? false,
        published: dto.published ?? true,
        sortOrder: dto.sortOrder ?? 0,
        // Start in DRAFT status - file fields are nullable
        status: DocumentStatus.DRAFT,
        // fileName and fileUrl will be set after file upload
      },
    });

    // Link to products
    if (dto.productIds?.length) {
      await this.prisma.productDocument.createMany({
        data: dto.productIds.map((productId) => ({
          productId,
          documentId: document.id,
        })),
        skipDuplicates: true,
      });
    }

    // Link to applications
    if (dto.applicationIds?.length) {
      await this.prisma.applicationDocument.createMany({
        data: dto.applicationIds.map((applicationId) => ({
          applicationId,
          documentId: document.id,
        })),
        skipDuplicates: true,
      });
    }

    this.logger.log(`Document created in DRAFT status: ${document.id}`);

    return document;
  }

  /**
   * Find document by ID
   */
  async findById(id: string): Promise<{
    id: string;
    name: string;
    nameEn: string | null;
    type: DocumentType;
    status: DocumentStatus;
    fileUrl: string | null;
    fileSize: number | null;
    mimeType: string | null;
    language: string;
    version: string | null;
    pages: number | null;
    leadRequired: boolean;
    isPublic: boolean;
    downloadCount: number;
    published: boolean;
    publishedAt: Date | null;
    archivedAt: Date | null;
    sortOrder: number;
    products: Array<{ id: string; name: string; model: string }>;
    applications: Array<{ id: string; name: string; slug: string }>;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              select: { id: true, model: true, translations: { where: { locale: 'en' }, take: 1 } },
            },
          },
        },
        applications: {
          include: {
            application: {
              select: { id: true, slug: true, translations: { where: { locale: 'en' }, take: 1 } },
            },
          },
        },
      },
    });

    if (!document || document.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    return {
      id: document.id,
      name: document.name,
      nameEn: document.nameEn,
      type: document.type,
      status: document.status,
      fileUrl: document.fileUrl,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      language: document.language,
      version: document.version,
      pages: document.pages,
      leadRequired: document.leadRequired,
      isPublic: document.isPublic,
      downloadCount: document.downloadCount,
      published: document.published,
      publishedAt: document.publishedAt,
      archivedAt: document.archivedAt,
      sortOrder: document.sortOrder,
      products: document.products.map((p) => ({
        id: p.product.id,
        name: p.product.translations[0]?.name || p.product.model,
        model: p.product.model,
      })),
      applications: document.applications.map((a) => ({
        id: a.application.id,
        name: a.application.translations[0]?.name || a.application.id,
        slug: a.application.slug,
      })),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  /**
   * List documents with filters and pagination
   */
  async findAll(query: QueryDocumentDto): Promise<{
    items: Array<{
      id: string;
      name: string;
      nameEn: string | null;
      type: DocumentType;
      status: DocumentStatus;
      fileUrl: string | null;
      fileSize: number | null;
      language: string;
      leadRequired: boolean;
      downloadCount: number;
      published: boolean;
      publishedAt: Date | null;
      productCount: number;
      applicationCount: number;
      createdAt: Date;
    }>;
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = buildDocumentWhere(query);

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        include: {
          products: { select: { productId: true } },
          applications: { select: { applicationId: true } },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      items: documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        nameEn: doc.nameEn,
        type: doc.type,
        status: doc.status,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        language: doc.language,
        leadRequired: doc.leadRequired,
        downloadCount: doc.downloadCount,
        published: doc.published,
        publishedAt: doc.publishedAt,
        productCount: doc.products.length,
        applicationCount: doc.applications.length,
        createdAt: doc.createdAt,
      })),
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update document
   */
  async update(id: string, dto: UpdateDocumentDto): Promise<{
    id: string;
    name: string;
    status: DocumentStatus;
    published: boolean;
    updatedAt: Date;
  }> {
    // Verify document exists
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    // Handle status transition
    let statusUpdate: DocumentStatus | undefined;
    let publishedAtUpdate: Date | undefined;
    let archivedAtUpdate: Date | undefined;

    if (dto.status !== undefined && dto.status !== existing.status) {
      // Validate status transition
      this.validateStatusTransition(existing.status, dto.status);
      statusUpdate = dto.status;

      // Auto-set timestamps based on status
      if (dto.status === DocumentStatus.PUBLISHED && !existing.publishedAt) {
        publishedAtUpdate = new Date();
      }
      if (dto.status === DocumentStatus.ARCHIVED && !existing.archivedAt) {
        archivedAtUpdate = new Date();
      }
    }

    // Build update data
    const updateData: Prisma.DocumentUpdateInput = {
      name: dto.name,
      nameEn: dto.nameEn,
      type: dto.type,
      language: dto.language,
      version: dto.version,
      pages: dto.pages,
      leadRequired: dto.leadRequired,
      isPublic: dto.isPublic,
      published: dto.published,
      sortOrder: dto.sortOrder,
    };

    if (statusUpdate) {
      updateData.status = statusUpdate;
    }
    if (publishedAtUpdate) {
      updateData.publishedAt = publishedAtUpdate;
    }
    if (archivedAtUpdate) {
      updateData.archivedAt = archivedAtUpdate;
    }

    // Update document
    const document = await this.prisma.document.update({
      where: { id },
      data: updateData,
    });

    // Update product links if provided
    if (dto.productIds !== undefined) {
      // Remove existing links
      await this.prisma.productDocument.deleteMany({
        where: { documentId: id },
      });
      // Add new links
      if (dto.productIds.length > 0) {
        await this.prisma.productDocument.createMany({
          data: dto.productIds.map((productId) => ({
            productId,
            documentId: id,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Update application links if provided
    if (dto.applicationIds !== undefined) {
      await this.prisma.applicationDocument.deleteMany({
        where: { documentId: id },
      });
      if (dto.applicationIds.length > 0) {
        await this.prisma.applicationDocument.createMany({
          data: dto.applicationIds.map((applicationId) => ({
            applicationId,
            documentId: id,
          })),
          skipDuplicates: true,
        });
      }
    }

    this.logger.log(`Document updated: ${id}, status: ${document.status}`);

    return {
      id: document.id,
      name: document.name,
      status: document.status,
      published: document.published,
      updatedAt: document.updatedAt,
    };
  }

  /**
   * Validate status transition
   */
  private validateStatusTransition(current: DocumentStatus, next: DocumentStatus): void {
    const allowedTransitions: Record<DocumentStatus, DocumentStatus[]> = {
      [DocumentStatus.DRAFT]: [DocumentStatus.UPLOADING],
      [DocumentStatus.UPLOADING]: [DocumentStatus.DRAFT, DocumentStatus.READY],
      [DocumentStatus.READY]: [DocumentStatus.DRAFT, DocumentStatus.PUBLISHED],
      [DocumentStatus.PUBLISHED]: [DocumentStatus.ARCHIVED],
      [DocumentStatus.ARCHIVED]: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(
        `Invalid status transition from ${current} to ${next}`,
      );
    }
  }

  /**
   * Publish document (READY -> PUBLISHED)
   */
  async publish(id: string): Promise<{ id: string; status: DocumentStatus }> {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (existing.status !== DocumentStatus.READY) {
      throw new BadRequestException('Document must be in READY status to publish');
    }

    if (!existing.fileUrl || !existing.fileName) {
      throw new BadRequestException('Document must have a file before publishing');
    }

    const document = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.PUBLISHED,
        publishedAt: new Date(),
        published: true,
      },
    });

    this.logger.log(`Document published: ${id}`);

    return { id: document.id, status: document.status };
  }

  /**
   * Archive document (PUBLISHED -> ARCHIVED)
   */
  async archive(id: string): Promise<{ id: string; status: DocumentStatus }> {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (existing.status !== DocumentStatus.PUBLISHED) {
      throw new BadRequestException('Document must be in PUBLISHED status to archive');
    }

    const document = await this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.ARCHIVED,
        archivedAt: new Date(),
        published: false,
      },
    });

    this.logger.log(`Document archived: ${id}`);

    return { id: document.id, status: document.status };
  }

  /**
   * Soft delete document
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Document soft deleted: ${id}`);

    return { success: true };
  }

  /**
   * Upload file and update document (UPLOADING -> READY)
   * Implements compensation logic for Storage-DB consistency
   */
  async uploadFile(
    id: string,
    file: { filename: string; url: string; size: number; mimeType: string },
  ): Promise<{ id: string; fileUrl: string; status: DocumentStatus }> {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    // Update document with file info and transition to READY
    const document = await this.prisma.document.update({
      where: { id },
      data: {
        fileName: file.filename,
        fileUrl: file.url,
        fileSize: file.size,
        mimeType: file.mimeType,
        status: DocumentStatus.READY,
      },
    });

    this.logger.log(`Document file uploaded and ready: ${id}`);

    return {
      id: document.id,
      fileUrl: document.fileUrl!,
      status: document.status,
    };
  }
}
