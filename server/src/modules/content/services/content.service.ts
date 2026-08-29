import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export const ALLOWED_PAGES = [
  'home',
  'about',
  'cases',
  'contact',
  'technology',
  'products',
  'news',
] as const;

export type AllowedPage = (typeof ALLOWED_PAGES)[number];

@Injectable()
export class ContentService {
  private logger = new Logger(ContentService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==================== Public ====================

  async getPublic(page: string, locale: string) {
    if (!ALLOWED_PAGES.includes(page as AllowedPage)) {
      throw new NotFoundException('Page not found');
    }
    const row = await this.prisma.pageContent.findUnique({
      where: { page_locale: { page, locale } },
    });
    if (!row || !row.published) {
      return { page, locale, content: {} };
    }
    return { page, locale, content: row.content };
  }

  // ==================== Admin ====================

  async findAllAdmin() {
    const rows = await this.prisma.pageContent.findMany({
      orderBy: { page: 'asc' },
      select: {
        page: true,
        locale: true,
        published: true,
        updatedAt: true,
      },
    });

    // Group by page
    const map = new Map<string, { page: string; locales: Array<{ locale: string; published: boolean; updatedAt: Date }> }>();
    for (const r of rows) {
      if (!map.has(r.page)) {
        map.set(r.page, { page: r.page, locales: [] });
      }
      map.get(r.page)!.locales.push({ locale: r.locale, published: r.published, updatedAt: r.updatedAt });
    }

    const items = Array.from(map.values());
    return {
      items,
      meta: { page: 1, pageSize: items.length, total: items.length, totalPages: 1 },
    };
  }

  async findOneAdmin(page: string) {
    if (!ALLOWED_PAGES.includes(page as AllowedPage)) {
      throw new NotFoundException('Page not found');
    }
    const rows = await this.prisma.pageContent.findMany({
      where: { page },
      select: { locale: true, content: true, published: true, updatedAt: true },
    });
    return {
      page,
      locales: rows.map((r) => ({
        locale: r.locale,
        content: r.content,
        published: r.published,
        updatedAt: r.updatedAt,
      })),
    };
  }

  async upsert(page: string, locale: string, dto: { content: Record<string, unknown>; published?: boolean }) {
    if (!ALLOWED_PAGES.includes(page as AllowedPage)) {
      throw new NotFoundException('Page not found');
    }
    if (locale !== 'en' && locale !== 'zh') {
      throw new BadRequestException('Locale must be en or zh');
    }
    if (dto.content === null || typeof dto.content !== 'object' || Array.isArray(dto.content)) {
      throw new BadRequestException('content must be a JSON object');
    }

    const row = await this.prisma.pageContent.upsert({
      where: { page_locale: { page, locale } },
      update: {
        content: dto.content,
        published: dto.published ?? true,
      },
      create: {
        page,
        locale,
        content: dto.content,
        published: dto.published ?? true,
      },
    });

    this.logger.log(`Content upserted: ${page}/${locale}`);
    return { page, locale, content: row.content, published: row.published };
  }

  async patchSection(page: string, locale: string, dto: { content: Record<string, unknown>; published?: boolean }) {
    if (!ALLOWED_PAGES.includes(page as AllowedPage)) {
      throw new NotFoundException('Page not found');
    }
    if (locale !== 'en' && locale !== 'zh') {
      throw new BadRequestException('Locale must be en or zh');
    }
    if (dto.content === null || typeof dto.content !== 'object' || Array.isArray(dto.content)) {
      throw new BadRequestException('content must be a JSON object');
    }

    const existing = await this.prisma.pageContent.findUnique({
      where: { page_locale: { page, locale } },
    });

    const merged = {
      ...(existing?.content as Record<string, unknown> | undefined),
      ...dto.content,
    };

    const row = await this.prisma.pageContent.upsert({
      where: { page_locale: { page, locale } },
      update: {
        content: merged,
        ...(dto.published !== undefined ? { published: dto.published } : {}),
      },
      create: {
        page,
        locale,
        content: merged,
        published: dto.published ?? true,
      },
    });

    this.logger.log(`Content patched: ${page}/${locale}`);
    return { page, locale, content: row.content, published: row.published };
  }
}
