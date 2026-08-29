import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto } from '../dto';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==================== Public API ====================

  async findAllPublic(includeCounts: boolean = false) {
    const categories = await this.prisma.productCategory.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
            icon: true,
          },
        },
        children: {
          where: { published: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            slug: true,
            icon: true,
            image: true,
            sortOrder: true,
          },
        },
        ...(includeCounts && {
          _count: {
            select: { products: true },
          },
        }),
      },
    });

    return this.buildTree(categories, includeCounts);
  }

  async findOnePublic(slug: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
            icon: true,
          },
        },
        children: {
          where: { published: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            slug: true,
            icon: true,
            image: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // ==================== Admin API ====================

  async findAllAdmin(query: QueryCategoryDto) {
    const { page = 1, limit = 50, includeCounts = true } = query;
    const skip = (page - 1) * limit;

    const [rawItems, total] = await Promise.all([
      this.prisma.productCategory.findMany({
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
        include: {
          parent: {
            select: {
              id: true,
              slug: true,
              icon: true,
            },
          },
          children: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              slug: true,
              sortOrder: true,
            },
          },
          translations: true,
          ...(includeCounts && {
            _count: {
              select: { products: true, children: true },
            },
          }),
        },
      }),
      this.prisma.productCategory.count(),
    ]);

    const items = rawItems.map((c: any) => this.flattenTranslation(c));

    return {
      items,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneAdmin(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        translations: true,
        products: {
          where: { deletedAt: null },
          select: {
            id: true,
            model: true,
            slug: true,
            published: true,
          },
          take: 10,
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.flattenTranslation(category);
  }

  async create(dto: CreateCategoryDto) {
    // Check slug uniqueness
    const existing = await this.prisma.productCategory.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Category with this slug already exists');
    }

    // Check parent exists if provided
    if (dto.parentId) {
      const parent = await this.prisma.productCategory.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
      // Prevent circular reference
      if (parent.parentId) {
        throw new BadRequestException('Cannot create nested category more than 2 levels deep');
      }
    }

    const category = await this.prisma.productCategory.create({
      data: {
        slug: dto.slug,
        image: dto.image,
        icon: dto.icon,
        parentId: dto.parentId,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex ?? false,
        sortOrder: dto.sortOrder ?? 0,
        published: dto.published ?? true,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    // Upsert display-name translations
    if (dto.name || dto.nameZh) {
      await this.upsertTranslations(category.id, dto.name, dto.nameZh);
    }

    this.logger.log(`Category created: ${category.id}`);
    return this.flattenTranslation(category, dto.name, dto.nameZh);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.productCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    // Check slug uniqueness if changing
    if (dto.slug && dto.slug !== existing.slug) {
      const duplicate = await this.prisma.productCategory.findUnique({
        where: { slug: dto.slug },
      });
      if (duplicate) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Check parent if changing
    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }
      if (dto.parentId) {
        const parent = await this.prisma.productCategory.findUnique({
          where: { id: dto.parentId },
        });
        if (!parent) {
          throw new BadRequestException('Parent category not found');
        }
        // Prevent circular reference
        if (parent.parentId) {
          throw new BadRequestException('Cannot create nested category more than 2 levels deep');
        }
      }
    }

    const category = await this.prisma.productCategory.update({
      where: { id },
      data: {
        slug: dto.slug,
        image: dto.image,
        icon: dto.icon,
        parentId: dto.parentId,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex,
        sortOrder: dto.sortOrder,
        published: dto.published,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    // Upsert display-name translations
    if (dto.name || dto.nameZh) {
      await this.upsertTranslations(id, dto.name, dto.nameZh);
    }

    this.logger.log(`Category updated: ${category.id}`);
    return this.flattenTranslation(category, dto.name, dto.nameZh);
  }

  async delete(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check for products
    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category._count.products} products. Move or delete products first.`,
      );
    }

    // Check for children
    if (category._count.children > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category._count.children} child categories. Delete children first.`,
      );
    }

    await this.prisma.productCategory.delete({
      where: { id },
    });

    this.logger.log(`Category deleted: ${id}`);
    return { success: true, message: 'Category deleted successfully' };
  }

  // ==================== Helpers ====================

  private async upsertTranslations(categoryId: string, name?: string, nameZh?: string) {
    const upsert = (locale: string, value?: string) => {
      if (!value || value.trim() === '') return;
      return this.prisma.productCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId, locale } },
        update: { name: value.trim() },
        create: { categoryId, locale, name: value.trim() },
      });
    };
    await Promise.all([upsert('en', name), upsert('zh', nameZh)]);
  }

  // Flatten the translations array into top-level name/nameZh for the response.
  private flattenTranslation(category: any, name?: string, nameZh?: string): any {
    const en = category.translations?.find((t: any) => t.locale === 'en')?.name;
    const zh = category.translations?.find((t: any) => t.locale === 'zh')?.name;
    return {
      ...category,
      name: name ?? en ?? null,
      nameZh: nameZh ?? zh ?? null,
    };
  }

  private buildTree(categories: any[], includeCounts: boolean): any[] {
    const map = new Map();
    const roots: any[] = [];

    // First pass: create map
    categories.forEach((cat) => {
      map.set(cat.id, {
        ...cat,
        children: [],
        productCount: includeCounts ? cat._count?.products : undefined,
      });
    });

    // Second pass: build tree
    categories.forEach((cat) => {
      const node = map.get(cat.id);
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId).children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
