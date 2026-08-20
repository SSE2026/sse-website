import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
  QueryApplicationDto,
  LinkProductDto,
} from '../dto';

@Injectable()
export class ApplicationService {
  private logger = new Logger(ApplicationService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==================== Public API ====================

  async findAllPublic() {
    const applications = await this.prisma.application.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: true,
      },
    });

    return applications.map((app) => this.transformApplication(app));
  }

  async findOnePublic(slug: string) {
    const application = await this.prisma.application.findUnique({
      where: { slug },
      include: {
        translations: true,
        products: {
          where: {
            product: {
              published: true,
              deletedAt: null,
            },
          },
          include: {
            product: {
              include: {
                images: {
                  orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                  take: 1,
                },
              },
            },
          },
          take: 12,
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return {
      ...this.transformApplication(application),
      products: application.products.map((pa) => ({
        id: pa.product.id,
        slug: pa.product.slug,
        model: pa.product.model,
        image: pa.product.images[0] || null,
        priority: pa.priority,
      })),
    };
  }

  // ==================== Admin API ====================

  async findAllAdmin(query: QueryApplicationDto) {
    const { page = 1, limit = 50, includeCounts = true } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
        include: {
          translations: true,
          ...(includeCounts && {
            _count: {
              select: { products: true },
            },
          }),
        },
      }),
      this.prisma.application.count(),
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
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        translations: true,
        products: {
          include: {
            product: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async create(dto: CreateApplicationDto) {
    const existing = await this.prisma.application.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Application with this slug already exists');
    }

    const application = await this.prisma.application.create({
      data: {
        slug: dto.slug,
        image: dto.image,
        icon: dto.icon,
        color: dto.color,
        shortDescription: dto.shortDescription,
        description: dto.description,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex ?? false,
        sortOrder: dto.sortOrder ?? 0,
        published: dto.published ?? true,
      },
    });

    this.logger.log(`Application created: ${application.id}`);
    return application;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    const existing = await this.prisma.application.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Application not found');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const duplicate = await this.prisma.application.findUnique({
        where: { slug: dto.slug },
      });
      if (duplicate) {
        throw new ConflictException('Application with this slug already exists');
      }
    }

    const application = await this.prisma.application.update({
      where: { id },
      data: {
        slug: dto.slug,
        image: dto.image,
        icon: dto.icon,
        color: dto.color,
        shortDescription: dto.shortDescription,
        description: dto.description,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex,
        sortOrder: dto.sortOrder,
        published: dto.published,
      },
    });

    this.logger.log(`Application updated: ${application.id}`);
    return application;
  }

  async delete(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    await this.prisma.application.delete({
      where: { id },
    });

    this.logger.log(`Application deleted: ${id}`);
    return { success: true, message: 'Application deleted successfully' };
  }

  // ==================== Product-Application Relation ====================

  async linkProduct(applicationId: string, dto: LinkProductDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already linked
    const existing = await this.prisma.productApplication.findFirst({
      where: {
        applicationId,
        productId: dto.productId,
      },
    });
    if (existing) {
      throw new ConflictException('Product is already linked to this application');
    }

    const link = await this.prisma.productApplication.create({
      data: {
        applicationId,
        productId: dto.productId,
        priority: dto.priority ?? 0,
      },
    });

    this.logger.log(`Product ${dto.productId} linked to application ${applicationId}`);
    return link;
  }

  async unlinkProduct(applicationId: string, productId: string) {
    const link = await this.prisma.productApplication.findFirst({
      where: { applicationId, productId },
    });
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.prisma.productApplication.delete({
      where: { id: link.id },
    });

    this.logger.log(`Product ${productId} unlinked from application ${applicationId}`);
    return { success: true, message: 'Product unlinked successfully' };
  }

  // ==================== Helpers ====================

  private transformApplication(application: any) {
    const translation = application.translations?.[0];
    return {
      id: application.id,
      slug: application.slug,
      image: application.image,
      icon: application.icon,
      color: application.color,
      name: translation?.name || application.slug,
      shortDescription: translation?.shortDescription || application.shortDescription,
      description: translation?.description || application.description,
      seoTitle: translation?.seoTitle || application.seoTitle,
      seoDescription: translation?.seoDescription || application.seoDescription,
      canonicalUrl: application.canonicalUrl,
      noIndex: application.noIndex,
      sortOrder: application.sortOrder,
      published: application.published,
      productCount: application._count?.products,
    };
  }
}
