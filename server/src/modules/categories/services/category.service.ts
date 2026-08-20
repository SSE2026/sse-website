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

    const [items, total] = await Promise.all([
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
          ...(includeCounts && {
            _count: {
              select: { products: true, children: true },
            },
          }),
        },
      }),
      this.prisma.productCategory.count(),
    ]);

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

    return category;
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

    this.logger.log(`Category created: ${category.id}`);
    return category;
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

    this.logger.log(`Category updated: ${category.id}`);
    return category;
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
