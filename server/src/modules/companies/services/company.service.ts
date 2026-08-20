import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Company } from '@prisma/client';

/**
 * Company Service
 * Handles company lookup with conservative matching
 *
 * IMPORTANT: Phase 3.3 does NOT auto-create companies
 * Company creation is done manually by admin to avoid duplicates
 */
@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find company by name with case-insensitive matching
   * Uses conservative matching - only matches exact normalized names
   */
  async findByName(name: string): Promise<Company | null> {
    if (!name) return null;

    const normalizedName = this.normalizeCompanyName(name);

    return this.prisma.company.findFirst({
      where: {
        isActive: true,
        name: {
          equals: normalizedName,
        },
      },
    });
  }

  /**
   * List companies with pagination
   */
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
  }): Promise<{ items: Company[]; total: number }> {
    const { page = 1, limit = 20, search, country } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
      ...(country && { country }),
    };

    const [items, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Find company by ID
   */
  async findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        customers: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Normalize company name for matching
   * - Trim whitespace
   * - Collapse multiple spaces
   * - Convert to uppercase
   */
  private normalizeCompanyName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }
}
