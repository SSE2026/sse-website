import { Test, TestingModule } from '@nestjs/testing';
import { EmailService, EMAIL_SERVICE } from '../../email/interfaces/email-service.interface';
import { CustomerService } from '../../customers/services/customer.service';
import { InquiryService } from '../services/inquiry.service';
import { InquiryNumberService } from '../services/inquiry-number.service';
import { SnapshotService } from '../services/snapshot.service';
import { LeadActivityService } from '../services/lead-activity.service';
import { LocalStorageService } from '../../storage/services/local-storage.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { InquiryType, InquiryStatus, ActivityType, LeadSource } from '@prisma/client';
import { StatusTransitionValidator } from '../validators/status-transition.validator';
import { BadRequestException } from '@nestjs/common';

// Mock Prisma Service
const mockPrisma = {
  inquiry: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  customer: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
  productVariant: {
    findUnique: jest.fn(),
  },
  leadActivity: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  inquiryAttachment: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Mock Email Service
const mockEmailService = {
  sendInquiryNotification: jest.fn().mockResolvedValue(undefined),
  sendCustomerConfirmation: jest.fn().mockResolvedValue(undefined),
};

// Mock Storage Service
const mockStorageService = {
  upload: jest.fn().mockResolvedValue({
    path: 'inquiries/test.pdf',
    url: '/uploads/inquiries/test.pdf',
    originalName: 'test.pdf',
    mimeType: 'application/pdf',
    size: 1024,
  }),
};

describe('InquiryService', () => {
  let service: InquiryService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiryService,
        InquiryNumberService,
        SnapshotService,
        LeadActivityService,
        CustomerService,
        StatusTransitionValidator,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EMAIL_SERVICE, useValue: mockEmailService },
        { provide: LocalStorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<InquiryService>(InquiryService);
    prisma = module.get(PrismaService);
  });

  describe('Status Transition Validator', () => {
    const validator = new StatusTransitionValidator();

    it('should allow valid transition NEW -> CONTACTED', () => {
      expect(validator.canTransition(InquiryStatus.NEW, InquiryStatus.CONTACTED)).toBe(true);
    });

    it('should allow valid transition NEW -> LOST', () => {
      expect(validator.canTransition(InquiryStatus.NEW, InquiryStatus.LOST)).toBe(true);
    });

    it('should reject invalid transition NEW -> WON', () => {
      expect(validator.canTransition(InquiryStatus.NEW, InquiryStatus.WON)).toBe(false);
    });

    it('should reject invalid transition NEW -> QUOTING', () => {
      expect(validator.canTransition(InquiryStatus.NEW, InquiryStatus.QUOTING)).toBe(false);
    });

    it('should allow valid transition NEW -> LOST -> NEW (reactivation)', () => {
      expect(validator.canTransition(InquiryStatus.LOST, InquiryStatus.NEW)).toBe(true);
    });

    it('should reject transition from WON (terminal state)', () => {
      expect(validator.canTransition(InquiryStatus.WON, InquiryStatus.LOST)).toBe(false);
    });

    it('should validate and throw on invalid transition', () => {
      expect(() => {
        validator.validate(InquiryStatus.NEW, InquiryStatus.WON);
      }).toThrow(BadRequestException);
    });

    it('should validate and throw when status is unchanged', () => {
      expect(() => {
        validator.validate(InquiryStatus.NEW, InquiryStatus.NEW);
      }).toThrow(BadRequestException);
    });

    it('should get valid next statuses', () => {
      const nextStatuses = validator.getValidNextStatuses(InquiryStatus.NEW);
      expect(nextStatuses).toContain(InquiryStatus.CONTACTED);
      expect(nextStatuses).toContain(InquiryStatus.LOST);
      expect(nextStatuses).not.toContain(InquiryStatus.WON);
    });
  });

  describe('Inquiry Creation', () => {
    beforeEach(() => {
      // Setup transaction mock
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });
    });

    it('should create an anonymous PRODUCT inquiry with snapshot', async () => {
      // Setup mocks
      const mockProduct = {
        id: 'prod_123',
        model: 'BATT-001',
        sku: 'BATT-001-48V',
        nominalVoltage: 48,
        nominalCapacity: 50,
        energy: 2400,
        energyDensity: 350,
        weight: 6.8,
        length: 400,
        width: 300,
        height: 150,
        cycleLife: 1000,
        chargeRate: 5,
        dischargeRate: 10,
        specifications: null,
        translations: [{ name: '48V Battery Pack', locale: 'en' }],
      };

      const mockCustomer = {
        id: 'cust_123',
        email: 'john@test.com',
        name: 'John Doe',
        companyId: null,
        source: 'DIRECT' as LeadSource,
      };

      const mockInquiry = {
        id: 'inq_123',
        inquiryNumber: 'INQ-20260802-0001',
        inquiryType: InquiryType.PRODUCT,
        status: InquiryStatus.NEW,
        customerId: 'cust_123',
        email: 'john@test.com',
        customerName: 'John Doe',
        productId: 'prod_123',
        productName: '48V Battery Pack',
        voltageSnapshot: '48V',
        capacitySnapshot: '50Ah',
        quantity: 100,
      };

      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(mockCustomer);
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.inquiry.findFirst.mockResolvedValue(null);
      mockPrisma.inquiry.create.mockResolvedValue(mockInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });
      mockPrisma.customer.update.mockResolvedValue(mockCustomer);

      const dto = {
        inquiryType: InquiryType.PRODUCT,
        email: 'john@test.com',
        customerName: 'John Doe',
        productId: 'prod_123',
        quantity: 100,
      };

      const result = await service.create(dto);

      expect(result.inquiryNumber).toBe('INQ-20260802-0001');
      expect(result.status).toBe(InquiryStatus.NEW);
      expect(mockPrisma.inquiry.create).toHaveBeenCalled();
      expect(mockPrisma.leadActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: ActivityType.STATUS_CHANGE,
          }),
        }),
      );
    });

    it('should create a new Customer for new email', async () => {
      const mockCustomer = {
        id: 'cust_123',
        email: 'new@test.com',
        name: 'New User',
        companyId: null,
        source: 'DIRECT' as LeadSource,
      };

      const mockInquiry = {
        id: 'inq_123',
        inquiryNumber: 'INQ-20260802-0001',
        inquiryType: InquiryType.GENERAL,
        status: InquiryStatus.NEW,
        customerId: 'cust_123',
        email: 'new@test.com',
        customerName: 'New User',
      };

      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(mockCustomer);
      mockPrisma.inquiry.findFirst.mockResolvedValue(null);
      mockPrisma.inquiry.create.mockResolvedValue(mockInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });
      mockPrisma.customer.update.mockResolvedValue(mockCustomer);

      const dto = {
        inquiryType: InquiryType.GENERAL,
        email: 'new@test.com',
        customerName: 'New User',
      };

      await service.create(dto);

      expect(mockPrisma.customer.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'new@test.com',
            name: 'New User',
          }),
        }),
      );
    });

    it('should reuse existing Customer for known email', async () => {
      const existingCustomer = {
        id: 'cust_123',
        email: 'existing@test.com',
        name: 'Existing User',
        companyId: null,
        source: 'DIRECT' as LeadSource,
        lastActivityAt: new Date('2026-08-01'),
      };

      const mockInquiry = {
        id: 'inq_123',
        inquiryNumber: 'INQ-20260802-0001',
        inquiryType: InquiryType.GENERAL,
        status: InquiryStatus.NEW,
        customerId: 'cust_123',
        email: 'existing@test.com',
        customerName: 'Existing User',
      };

      mockPrisma.customer.findUnique.mockResolvedValue(existingCustomer);
      mockPrisma.customer.update.mockResolvedValue({
        ...existingCustomer,
        lastActivityAt: new Date(),
      });
      mockPrisma.inquiry.findFirst.mockResolvedValue(null);
      mockPrisma.inquiry.create.mockResolvedValue(mockInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });

      const dto = {
        inquiryType: InquiryType.GENERAL,
        email: 'existing@test.com',
        customerName: 'Existing User',
      };

      await service.create(dto);

      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
      expect(mockPrisma.customer.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'cust_123' },
          data: { lastActivityAt: expect.any(Date) },
        }),
      );
    });

    it('should create CUSTOM inquiry with requirement snapshot', async () => {
      const mockCustomer = {
        id: 'cust_123',
        email: 'custom@test.com',
        name: 'Custom User',
        companyId: null,
        source: 'DIRECT' as LeadSource,
      };

      const mockInquiry = {
        id: 'inq_123',
        inquiryNumber: 'INQ-20260802-0001',
        inquiryType: InquiryType.CUSTOM,
        status: InquiryStatus.NEW,
        customerId: 'cust_123',
        email: 'custom@test.com',
        customerName: 'Custom User',
        voltageSnapshot: '48V',
        capacitySnapshot: '100Ah',
      };

      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(mockCustomer);
      mockPrisma.inquiry.findFirst.mockResolvedValue(null);
      mockPrisma.inquiry.create.mockResolvedValue(mockInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });
      mockPrisma.customer.update.mockResolvedValue(mockCustomer);

      const dto = {
        inquiryType: InquiryType.CUSTOM,
        email: 'custom@test.com',
        customerName: 'Custom User',
        voltage: '48V',
        capacity: '100Ah',
        quantity: 500,
      };

      const result = await service.create(dto);

      expect(result.inquiryType).toBe(InquiryType.CUSTOM);
      expect(mockPrisma.inquiry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            voltageSnapshot: '48V',
            capacitySnapshot: '100Ah',
            quantity: 500,
          }),
        }),
      );
    });

    it('should create GENERAL inquiry without product snapshot', async () => {
      const mockCustomer = {
        id: 'cust_123',
        email: 'general@test.com',
        name: 'General User',
        companyId: null,
        source: 'DIRECT' as LeadSource,
      };

      const mockInquiry = {
        id: 'inq_123',
        inquiryNumber: 'INQ-20260802-0001',
        inquiryType: InquiryType.GENERAL,
        status: InquiryStatus.NEW,
        customerId: 'cust_123',
        email: 'general@test.com',
        customerName: 'General User',
        productId: null,
      };

      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(mockCustomer);
      mockPrisma.inquiry.findFirst.mockResolvedValue(null);
      mockPrisma.inquiry.create.mockResolvedValue(mockInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });
      mockPrisma.customer.update.mockResolvedValue(mockCustomer);

      const dto = {
        inquiryType: InquiryType.GENERAL,
        email: 'general@test.com',
        customerName: 'General User',
        message: 'Interested in partnership opportunities',
      };

      const result = await service.create(dto);

      expect(result.inquiryType).toBe(InquiryType.GENERAL);
      expect(result.productId).toBeNull();
    });
  });

  describe('UTM Capture', () => {
    beforeEach(() => {
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });
    });

    it('should save UTM parameters', async () => {
      const mockCustomer = {
        id: 'cust_123',
        email: 'utm@test.com',
        name: 'UTM User',
        companyId: null,
        source: 'GOOGLE_ADS' as LeadSource,
      };

      const mockInquiry = {
        id: 'inq_123',
        inquiryNumber: 'INQ-20260802-0001',
        inquiryType: InquiryType.GENERAL,
        status: InquiryStatus.NEW,
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'uav_battery',
        utmTerm: '48v_battery',
        utmContent: 'banner_1',
      };

      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue(mockCustomer);
      mockPrisma.inquiry.findFirst.mockResolvedValue(null);
      mockPrisma.inquiry.create.mockResolvedValue(mockInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });
      mockPrisma.customer.update.mockResolvedValue(mockCustomer);

      const dto = {
        inquiryType: InquiryType.GENERAL,
        email: 'utm@test.com',
        customerName: 'UTM User',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'uav_battery',
        utmTerm: '48v_battery',
        utmContent: 'banner_1',
        landingPage: '/products/uav-battery',
        referrer: 'https://google.com',
      };

      const result = await service.create(dto);

      expect(mockPrisma.inquiry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            utmSource: 'google',
            utmMedium: 'cpc',
            utmCampaign: 'uav_battery',
            utmTerm: '48v_battery',
            utmContent: 'banner_1',
          }),
        }),
      );
    });
  });

  describe('Status Update', () => {
    it('should allow valid status transition NEW -> CONTACTED', async () => {
      const existingInquiry = {
        id: 'inq_123',
        status: InquiryStatus.NEW,
        inquiryNumber: 'INQ-20260802-0001',
      };

      const updatedInquiry = {
        ...existingInquiry,
        status: InquiryStatus.CONTACTED,
      };

      mockPrisma.inquiry.findUnique.mockResolvedValue(existingInquiry);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.inquiry.update.mockResolvedValue(updatedInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });

      const result = await service.updateStatus(
        'inq_123',
        { status: InquiryStatus.CONTACTED },
        { userId: 'user_123', name: 'Sales Rep', email: 'sales@test.com', role: 'ANALYST' },
      );

      expect(result.status).toBe(InquiryStatus.CONTACTED);
      expect(mockPrisma.leadActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: ActivityType.STATUS_CHANGE,
            title: 'Status changed: NEW → CONTACTED',
          }),
        }),
      );
    });

    it('should reject invalid status transition NEW -> WON', async () => {
      const existingInquiry = {
        id: 'inq_123',
        status: InquiryStatus.NEW,
        inquiryNumber: 'INQ-20260802-0001',
      };

      mockPrisma.inquiry.findUnique.mockResolvedValue(existingInquiry);

      await expect(
        service.updateStatus(
          'inq_123',
          { status: InquiryStatus.WON },
          { userId: 'user_123', name: 'Sales Rep', email: 'sales@test.com', role: 'ANALYST' },
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create NOTE activity when note is provided', async () => {
      const existingInquiry = {
        id: 'inq_123',
        status: InquiryStatus.NEW,
        inquiryNumber: 'INQ-20260802-0001',
        customerId: 'cust_123',
      };

      const updatedInquiry = {
        ...existingInquiry,
        status: InquiryStatus.CONTACTED,
      };

      mockPrisma.inquiry.findUnique.mockResolvedValue(existingInquiry);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.inquiry.update.mockResolvedValue(updatedInquiry);
      mockPrisma.leadActivity.create.mockResolvedValue({ id: 'act_123' });

      await service.updateStatus(
        'inq_123',
        { status: InquiryStatus.CONTACTED, note: 'Called customer, confirmed requirements' },
        { userId: 'user_123', name: 'Sales Rep', email: 'sales@test.com', role: 'ANALYST' },
      );

      // Should have been called twice: STATUS_CHANGE + NOTE
      expect(mockPrisma.leadActivity.create).toHaveBeenCalledTimes(2);
    });
  });
});

describe('InquiryNumberService', () => {
  let service: InquiryNumberService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiryNumberService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<InquiryNumberService>(InquiryNumberService);
    prisma = module.get(PrismaService);
  });

  describe('generateWithTx', () => {
    it('should generate first inquiry number for the day', async () => {
      mockPrisma.inquiry.findFirst.mockResolvedValue(null);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });

      const number = await service.generate();

      expect(number).toMatch(/^INQ-\d{8}-0001$/);
    });

    it('should increment sequence number', async () => {
      // Use fake timers with fixed date to avoid date-dependent test failures
      const fixedDate = new Date('2026-08-02T12:00:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(fixedDate);

      mockPrisma.inquiry.findFirst.mockResolvedValue({
        inquiryNumber: 'INQ-20260802-0005',
      });
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrisma);
      });

      const number = await service.generate();

      expect(number).toBe('INQ-20260802-0006');

      // Restore real timers
      jest.useRealTimers();
    });
  });
});

describe('SnapshotService', () => {
  let service: SnapshotService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnapshotService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SnapshotService>(SnapshotService);
    prisma = module.get(PrismaService);
  });

  describe('generateProductSnapshot', () => {
    it('should generate snapshot from product', async () => {
      const mockProduct = {
        id: 'prod_123',
        model: 'BATT-001',
        nominalVoltage: 48,
        nominalCapacity: 50,
        energy: 2400,
        energyDensity: 350,
        weight: 6.8,
        length: 400,
        width: 300,
        height: 150,
        cycleLife: 1000,
        chargeRate: 5,
        dischargeRate: 10,
        specifications: { ipRating: 'IP67' },
        translations: [{ name: '48V Battery Pack', locale: 'en' }],
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      const snapshot = await service.generateProductSnapshot({
        inquiryType: InquiryType.PRODUCT,
        productId: 'prod_123',
        email: 'test@test.com',
        customerName: 'Test',
      } as any);

      expect(snapshot.productId).toBe('prod_123');
      expect(snapshot.productName).toBe('48V Battery Pack');
      expect(snapshot.voltageSnapshot).toBe('48V');
      expect(snapshot.capacitySnapshot).toBe('50Ah');
      expect(snapshot.energySnapshot).toBe('2400Wh');
      expect(snapshot.specificationsSnapshot).toEqual({ ipRating: 'IP67' });
    });

    it('should use variant values when variant is specified', async () => {
      const mockProduct = {
        id: 'prod_123',
        model: 'BATT-001',
        nominalVoltage: 48,
        nominalCapacity: 50,
        energy: 2400,
        energyDensity: 350,
        weight: 6.8,
        length: 400,
        width: 300,
        height: 150,
        cycleLife: 1000,
        chargeRate: 5,
        dischargeRate: 10,
        specifications: null,
        translations: [{ name: '48V Battery Pack', locale: 'en' }],
      };

      const mockVariant = {
        id: 'var_123',
        productId: 'prod_123',
        sku: 'BATT-001-48V-60AH',
        name: '60Ah Variant',
        nominalCapacity: 60,
        energy: 2880,
        specifications: { ipRating: 'IP68' },
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.productVariant.findUnique.mockResolvedValue(mockVariant);

      const snapshot = await service.generateProductSnapshot({
        inquiryType: InquiryType.PRODUCT,
        productId: 'prod_123',
        productVariantId: 'var_123',
        email: 'test@test.com',
        customerName: 'Test',
      } as any);

      expect(snapshot.productVariantId).toBe('var_123');
      expect(snapshot.variantName).toBe('60Ah Variant');
      expect(snapshot.variantSku).toBe('BATT-001-48V-60AH');
      expect(snapshot.capacitySnapshot).toBe('60Ah'); // Variant value
      expect(snapshot.energySnapshot).toBe('2880Wh'); // Variant value
    });
  });

  describe('generateRequirementSnapshot', () => {
    it('should generate snapshot from CUSTOM inquiry requirements', () => {
      const dto = {
        inquiryType: InquiryType.CUSTOM,
        email: 'custom@test.com',
        customerName: 'Custom User',
        voltage: '48V',
        capacity: '100Ah',
        energy: '4800Wh',
        energyDensity: '300 Wh/kg',
        weight: '15kg',
        dimensions: '500x300x200mm',
        chargeRate: '2C',
        dischargeRate: '3C',
        cycleLife: '2000 cycles',
        specifications: { certifications: ['UN38.3', 'IEC 62619'] },
      };

      const snapshot = service.generateRequirementSnapshot(dto as any);

      expect(snapshot.productId).toBeNull();
      expect(snapshot.voltageSnapshot).toBe('48V');
      expect(snapshot.capacitySnapshot).toBe('100Ah');
      expect(snapshot.specificationsSnapshot).toEqual({ certifications: ['UN38.3', 'IEC 62619'] });
    });
  });
});

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get(PrismaService);
  });

  describe('findOrCreate', () => {
    it('should create new customer for new email', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue({
        id: 'cust_new',
        email: 'new@test.com',
        name: 'New User',
        source: 'DIRECT',
      });

      const result = await service.findOrCreate({
        email: 'new@test.com',
        customerName: 'New User',
      });

      expect(result.email).toBe('new@test.com');
      expect(mockPrisma.customer.create).toHaveBeenCalled();
    });

    it('should reuse existing customer and update lastActivityAt', async () => {
      const existingCustomer = {
        id: 'cust_123',
        email: 'existing@test.com',
        name: 'Existing User',
        lastActivityAt: new Date('2026-08-01'),
        source: 'DIRECT',
      };

      mockPrisma.customer.findUnique.mockResolvedValue(existingCustomer);
      mockPrisma.customer.update.mockResolvedValue({
        ...existingCustomer,
        lastActivityAt: new Date(),
      });

      const result = await service.findOrCreate({
        email: 'existing@test.com',
        customerName: 'Existing User',
      });

      expect(result.id).toBe('cust_123');
      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
      expect(mockPrisma.customer.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'cust_123' },
          data: { lastActivityAt: expect.any(Date) },
        }),
      );
    });

    it('should map UTM source to LeadSource enum', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);
      mockPrisma.customer.create.mockResolvedValue({
        id: 'cust_new',
        email: 'google@test.com',
        name: 'Google User',
        source: 'GOOGLE_ADS',
      });

      await service.findOrCreate({
        email: 'google@test.com',
        customerName: 'Google User',
        utmSource: 'google',
        utmMedium: 'cpc',
      });

      expect(mockPrisma.customer.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            source: 'GOOGLE_ADS',
            utmSource: 'google',
            utmMedium: 'cpc',
          }),
        }),
      );
    });
  });
});
