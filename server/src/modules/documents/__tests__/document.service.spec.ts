import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from '../services/document.service';
import { DocumentDownloadService } from '../services/document-download.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DocumentType, DocumentStatus, LeadSource } from '@prisma/client';

// Mock Prisma Service
const mockPrisma = {
  document: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  productDocument: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  applicationDocument: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  documentDownload: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  customer: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  describe('create', () => {
    it('should create a document in DRAFT status without product/application links', async () => {
      const mockDocument = {
        id: 'doc_123',
        name: 'Datasheet',
        nameEn: 'English Name',
        type: DocumentType.DATASHEET,
        status: DocumentStatus.DRAFT,
        fileUrl: null,
        fileName: null,
        published: true,
        createdAt: new Date(),
      };

      mockPrisma.document.create.mockResolvedValue(mockDocument);

      const dto = {
        name: 'Datasheet',
        nameEn: 'English Name',
        type: DocumentType.DATASHEET,
        published: true,
      };

      const result = await service.create(dto);

      expect(result.id).toBe('doc_123');
      expect(result.name).toBe('Datasheet');
      expect(result.status).toBe(DocumentStatus.DRAFT);
      expect(mockPrisma.document.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Datasheet',
          nameEn: 'English Name',
          type: DocumentType.DATASHEET,
          status: DocumentStatus.DRAFT,
        }),
      });
    });

    it('should create document with product links', async () => {
      const mockDocument = {
        id: 'doc_123',
        name: 'Datasheet',
        type: DocumentType.DATASHEET,
        status: DocumentStatus.DRAFT,
        fileUrl: null,
        published: true,
        createdAt: new Date(),
      };

      mockPrisma.document.create.mockResolvedValue(mockDocument);
      mockPrisma.productDocument.createMany.mockResolvedValue({ count: 2 });

      const dto = {
        name: 'Datasheet',
        type: DocumentType.DATASHEET,
        productIds: ['prod_1', 'prod_2'],
      };

      const result = await service.create(dto);

      expect(result.id).toBe('doc_123');
      expect(mockPrisma.productDocument.createMany).toHaveBeenCalledWith({
        data: [
          { productId: 'prod_1', documentId: 'doc_123' },
          { productId: 'prod_2', documentId: 'doc_123' },
        ],
        skipDuplicates: true,
      });
    });

    it('should create document with application links', async () => {
      const mockDocument = {
        id: 'doc_123',
        name: 'Application Note',
        type: DocumentType.APPLICATION_NOTE,
        status: DocumentStatus.DRAFT,
        fileUrl: null,
        published: true,
        createdAt: new Date(),
      };

      mockPrisma.document.create.mockResolvedValue(mockDocument);
      mockPrisma.applicationDocument.createMany.mockResolvedValue({ count: 1 });

      const dto = {
        name: 'Application Note',
        type: DocumentType.APPLICATION_NOTE,
        applicationIds: ['app_1'],
      };

      const result = await service.create(dto);

      expect(result.id).toBe('doc_123');
      expect(mockPrisma.applicationDocument.createMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return document with products and applications', async () => {
      const mockDocument = {
        id: 'doc_123',
        name: 'Datasheet',
        nameEn: 'DS',
        type: DocumentType.DATASHEET,
        status: DocumentStatus.PUBLISHED,
        fileUrl: '/uploads/doc.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        language: 'en',
        version: '1.0',
        pages: 5,
        leadRequired: true,
        isPublic: false,
        downloadCount: 10,
        published: true,
        publishedAt: new Date(),
        archivedAt: null,
        sortOrder: 0,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [
          {
            product: {
              id: 'prod_1',
              model: 'BATT-001',
              translations: [{ name: 'Battery Pack' }],
            },
          },
        ],
        applications: [
          {
            application: {
              id: 'app_1',
              slug: 'uav',
              translations: [{ name: 'UAV' }],
            },
          },
        ],
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);

      const result = await service.findById('doc_123');

      expect(result.id).toBe('doc_123');
      expect(result.name).toBe('Datasheet');
      expect(result.status).toBe(DocumentStatus.PUBLISHED);
      expect(result.products).toHaveLength(1);
      expect(result.applications).toHaveLength(1);
    });

    it('should throw NotFoundException for deleted document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        deletedAt: new Date(),
      });

      await expect(service.findById('doc_123')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue(null);

      await expect(service.findById('non_existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated documents', async () => {
      const mockDocuments = [
        {
          id: 'doc_1',
          name: 'Doc 1',
          nameEn: null,
          type: DocumentType.DATASHEET,
          status: DocumentStatus.PUBLISHED,
          fileUrl: null,
          fileSize: null,
          language: 'en',
          leadRequired: true,
          downloadCount: 5,
          published: true,
          publishedAt: new Date(),
          products: [{ productId: 'prod_1' }],
          applications: [{ applicationId: 'app_1' }],
          createdAt: new Date(),
        },
      ];

      mockPrisma.document.findMany.mockResolvedValue(mockDocuments);
      mockPrisma.document.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].status).toBe(DocumentStatus.PUBLISHED);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should filter by published status', async () => {
      mockPrisma.document.findMany.mockResolvedValue([]);
      mockPrisma.document.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 20, published: true });

      expect(mockPrisma.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            published: true,
          }),
        }),
      );
    });

    it('should filter by type', async () => {
      mockPrisma.document.findMany.mockResolvedValue([]);
      mockPrisma.document.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 20, type: DocumentType.MSDS });

      expect(mockPrisma.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: DocumentType.MSDS,
          }),
        }),
      );
    });

    it('should filter by productId', async () => {
      mockPrisma.document.findMany.mockResolvedValue([]);
      mockPrisma.document.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 20, productId: 'prod_123' });

      expect(mockPrisma.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            products: { some: { productId: 'prod_123' } },
          }),
        }),
      );
    });
  });

  describe('publish', () => {
    it('should publish document from READY status', async () => {
      const mockDocument = {
        id: 'doc_123',
        status: DocumentStatus.READY,
        fileUrl: '/uploads/doc.pdf',
        fileName: 'doc.pdf',
        published: true,
        publishedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.document.update.mockResolvedValue({
        ...mockDocument,
        status: DocumentStatus.PUBLISHED,
      });

      const result = await service.publish('doc_123');

      expect(result.status).toBe(DocumentStatus.PUBLISHED);
      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: 'doc_123' },
        data: expect.objectContaining({
          status: DocumentStatus.PUBLISHED,
          publishedAt: expect.any(Date),
          published: true,
        }),
      });
    });

    it('should throw error when document is not in READY status', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        status: DocumentStatus.DRAFT,
        deletedAt: null,
      });

      await expect(service.publish('doc_123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('archive', () => {
    it('should archive document from PUBLISHED status', async () => {
      const mockDocument = {
        id: 'doc_123',
        status: DocumentStatus.PUBLISHED,
        published: true,
        archivedAt: null,
        deletedAt: null,
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.document.update.mockResolvedValue({
        ...mockDocument,
        status: DocumentStatus.ARCHIVED,
        published: false,
        archivedAt: new Date(),
      });

      const result = await service.archive('doc_123');

      expect(result.status).toBe(DocumentStatus.ARCHIVED);
      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: 'doc_123' },
        data: expect.objectContaining({
          status: DocumentStatus.ARCHIVED,
          archivedAt: expect.any(Date),
          published: false,
        }),
      });
    });

    it('should throw error when document is not in PUBLISHED status', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        status: DocumentStatus.DRAFT,
        deletedAt: null,
      });

      await expect(service.archive('doc_123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should soft delete document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        deletedAt: null,
      });
      mockPrisma.document.update.mockResolvedValue({
        id: 'doc_123',
        deletedAt: new Date(),
      });

      const result = await service.delete('doc_123');

      expect(result.success).toBe(true);
      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: 'doc_123' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException for non-existent document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue(null);

      await expect(service.delete('non_existent')).rejects.toThrow(NotFoundException);
    });
  });
});

describe('DocumentDownloadService', () => {
  let service: DocumentDownloadService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentDownloadService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DocumentDownloadService>(DocumentDownloadService);
  });

  describe('processDownload', () => {
    it('should throw NotFoundException for non-existent document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue(null);

      await expect(
        service.processDownload('doc_123', { email: 'test@test.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for deleted document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        deletedAt: new Date(),
      });

      await expect(
        service.processDownload('doc_123', { email: 'test@test.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for unpublished document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        deletedAt: null,
        published: false,
      });

      await expect(
        service.processDownload('doc_123', { email: 'test@test.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no file', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        deletedAt: null,
        published: true,
        fileUrl: null,
      });

      await expect(
        service.processDownload('doc_123', { email: 'test@test.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when email required but not provided', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_123',
        deletedAt: null,
        published: true,
        fileUrl: '/uploads/doc.pdf',
        leadRequired: true,
      });

      await expect(
        service.processDownload('doc_123', { email: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create new customer for new email', async () => {
      const mockDocument = {
        id: 'doc_123',
        deletedAt: null,
        published: true,
        fileUrl: '/uploads/doc.pdf',
        leadRequired: true,
        products: [],
      };

      const newCustomer = {
        id: 'cust_new',
        email: 'new@test.com',
        name: 'New User',
        source: LeadSource.DATASHEET,
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(newCustomer);
      mockPrisma.documentDownload.create.mockResolvedValue({ id: 'dl_1' });
      mockPrisma.document.update.mockResolvedValue(mockDocument);

      const result = await service.processDownload('doc_123', {
        email: 'new@test.com',
        name: 'New User',
      });

      expect(result.downloadUrl).toBe('/uploads/doc.pdf');
      expect(result.customerId).toBe('cust_new');
      expect(mockPrisma.customer.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'new@test.com',
          name: 'New User',
          source: LeadSource.DATASHEET,
        }),
      });
    });

    it('should reuse existing customer for known email', async () => {
      const mockDocument = {
        id: 'doc_123',
        deletedAt: null,
        published: true,
        fileUrl: '/uploads/doc.pdf',
        leadRequired: true,
        products: [],
      };

      const existingCustomer = {
        id: 'cust_existing',
        email: 'existing@test.com',
        name: 'Existing User',
        source: LeadSource.DIRECT,
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.customer.findUnique.mockResolvedValue(existingCustomer);
      mockPrisma.documentDownload.create.mockResolvedValue({ id: 'dl_1' });
      mockPrisma.document.update.mockResolvedValue(mockDocument);

      const result = await service.processDownload('doc_123', {
        email: 'existing@test.com',
        company: 'New Company', // Should NOT overwrite existing
      });

      expect(result.customerId).toBe('cust_existing');
      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
    });

    it('should increment download count', async () => {
      const mockDocument = {
        id: 'doc_123',
        deletedAt: null,
        published: true,
        fileUrl: '/uploads/doc.pdf',
        leadRequired: false, // No email required
        products: [],
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.documentDownload.create.mockResolvedValue({ id: 'dl_1' });
      mockPrisma.document.update.mockResolvedValue(mockDocument);

      await service.processDownload('doc_123', { email: 'test@test.com' });

      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: 'doc_123' },
        data: { downloadCount: { increment: 1 } },
      });
    });

    it('should create download record with correct source', async () => {
      const mockDocument = {
        id: 'doc_123',
        deletedAt: null,
        published: true,
        fileUrl: '/uploads/doc.pdf',
        leadRequired: false,
        products: [],
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.documentDownload.create.mockResolvedValue({ id: 'dl_1' });
      mockPrisma.document.update.mockResolvedValue(mockDocument);

      await service.processDownload('doc_123', { email: 'test@test.com' });

      expect(mockPrisma.documentDownload.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          documentId: 'doc_123',
          source: LeadSource.DATASHEET,
        }),
      });
    });
  });

  describe('getDownloadAnalytics', () => {
    it('should return download statistics', async () => {
      const mockDownloads = [
        { email: 'a@test.com', name: 'A', company: 'Company A', createdAt: new Date() },
        { email: 'b@test.com', name: 'B', company: 'Company B', createdAt: new Date() },
        { email: 'a@test.com', name: 'A', company: 'Company A', createdAt: new Date() },
      ];

      mockPrisma.documentDownload.findMany.mockResolvedValue(mockDownloads);

      const result = await service.getDownloadAnalytics('doc_123');

      expect(result.totalDownloads).toBe(3);
      expect(result.uniqueEmails).toBe(2);
      expect(result.recentDownloads).toHaveLength(3);
    });
  });
});
