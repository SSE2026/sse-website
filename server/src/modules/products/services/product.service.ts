import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
  SortField,
  SortOrder,
  CreateVariantDto,
  UpdateVariantDto,
  CreateImageDto,
  UpdateImageDto,
  CreateTranslationDto,
  UpdateTranslationDto,
} from '../dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==================== Public API ====================

  async findAllPublic(query: QueryProductDto) {
    const {
      page = 1,
      limit = 12,
      locale = 'en',
      search,
      category,
      categoryId,
      application,
      featured,
      minEnergyDensity,
      maxEnergyDensity,
      minCapacity,
      maxCapacity,
      sortBy = SortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      published: true,
      deletedAt: null,
    };

    // Category filter
    if (category || categoryId) {
      if (category) {
        const cat = await this.prisma.productCategory.findUnique({
          where: { slug: category },
        });
        if (cat) {
          where.categoryId = cat.id;
        }
      } else if (categoryId) {
        where.categoryId = categoryId;
      }
    }

    // Featured filter
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Energy density range
    if (minEnergyDensity !== undefined || maxEnergyDensity !== undefined) {
      where.energyDensity = {};
      if (minEnergyDensity !== undefined) {
        where.energyDensity.gte = minEnergyDensity;
      }
      if (maxEnergyDensity !== undefined) {
        where.energyDensity.lte = maxEnergyDensity;
      }
    }

    // Capacity range
    if (minCapacity !== undefined || maxCapacity !== undefined) {
      where.nominalCapacity = {};
      if (minCapacity !== undefined) {
        where.nominalCapacity.gte = minCapacity;
      }
      if (maxCapacity !== undefined) {
        where.nominalCapacity.lte = maxCapacity;
      }
    }

    // Search
    if (search) {
      where.OR = [
        { model: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Application filter
    if (application) {
      const app = await this.prisma.application.findUnique({
        where: { slug: application },
      });
      if (app) {
        where.productApplications = {
          some: { applicationId: app.id },
        };
      }
    }

    // Sort
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Execute query
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 5,
          },
          translations: {
            where: { locale },
          },
          productApplications: {
            include: { application: true },
          },
          variants: {
            where: { published: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Transform for response
    const transformedItems = items.map((product: any) =>
      this.transformProductForResponse(product, locale),
    );

    return {
      items: transformedItems,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOnePublic(slug: string, locale: string = 'en') {
    const product = await this.prisma.product.findFirst({
      where: {
        slug,
        published: true,
        deletedAt: null,
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
        translations: {
          where: { locale },
        },
        productApplications: {
          include: { application: true },
          orderBy: { priority: 'asc' },
        },
        variants: {
          where: { published: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.transformProductDetailForResponse(product, locale);
  }

  async findFeatured(locale: string = 'en') {
    const products = await this.prisma.product.findMany({
      where: {
        featured: true,
        published: true,
        deletedAt: null,
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          take: 3,
        },
        translations: {
          where: { locale },
        },
      },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    });

    return products.map((product: any) =>
      this.transformProductForResponse(product, locale),
    );
  }

  // ==================== Admin API ====================

  async findAllAdmin(query: QueryProductDto) {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      featured,
      sortBy = SortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (search) {
      where.OR = [
        { model: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          images: true,
          translations: true,
          variants: true,
          _count: {
            select: {
              variants: true,
              images: true,
              productApplications: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
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
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        translations: true,
        variants: {
          orderBy: { sortOrder: 'asc' },
        },
        productApplications: {
          include: { application: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    // Check for duplicate slug
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existingSlug) {
      throw new ConflictException('Product with this slug already exists');
    }

    // Check for duplicate SKU
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new ConflictException('Product with this SKU already exists');
    }

    // Check for duplicate model
    const existingModel = await this.prisma.product.findUnique({
      where: { model: dto.model },
    });
    if (existingModel) {
      throw new ConflictException('Product with this model already exists');
    }

    // Check category exists
    const category = await this.prisma.productCategory.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        sku: dto.sku,
        model: dto.model,
        slug: dto.slug,
        categoryId: dto.categoryId,
        brand: dto.brand,
        chemistry: dto.chemistry,
        shortDescription: dto.shortDescription,
        description: dto.description,
        nominalVoltage: dto.nominalVoltage,
        nominalCapacity: dto.nominalCapacity,
        energy: dto.energy,
        energyDensity: dto.energyDensity,
        chargeRate: dto.chargeRate,
        dischargeRate: dto.dischargeRate,
        peakDischargeRate: dto.peakDischargeRate,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        weight: dto.weight,
        cycleLife: dto.cycleLife,
        operatingTempMin: dto.operatingTempMin,
        operatingTempMax: dto.operatingTempMax,
        moq: dto.moq,
        sampleAvailable: dto.sampleAvailable ?? false,
        customizationAvailable: dto.customizationAvailable ?? false,
        leadTime: dto.leadTime,
        specifications: dto.specifications as Prisma.InputJsonValue,
        features: dto.features as Prisma.InputJsonValue,
        applications: dto.applications as Prisma.InputJsonValue,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex ?? false,
        published: dto.published ?? false,
        featured: dto.featured ?? false,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: {
        category: true,
        images: true,
        translations: true,
        variants: true,
      },
    });

    this.logger.log(`Product created: ${product.id}`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    // Check slug uniqueness if changing
    if (dto.slug && dto.slug !== existing.slug) {
      const duplicateSlug = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (duplicateSlug) {
        throw new ConflictException('Product with this slug already exists');
      }
    }

    // Check SKU uniqueness if changing
    if (dto.sku && dto.sku !== existing.sku) {
      const duplicateSku = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });
      if (duplicateSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Check category if changing
    if (dto.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        sku: dto.sku,
        model: dto.model,
        slug: dto.slug,
        categoryId: dto.categoryId,
        brand: dto.brand,
        chemistry: dto.chemistry,
        shortDescription: dto.shortDescription,
        description: dto.description,
        nominalVoltage: dto.nominalVoltage,
        nominalCapacity: dto.nominalCapacity,
        energy: dto.energy,
        energyDensity: dto.energyDensity,
        chargeRate: dto.chargeRate,
        dischargeRate: dto.dischargeRate,
        peakDischargeRate: dto.peakDischargeRate,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        weight: dto.weight,
        cycleLife: dto.cycleLife,
        operatingTempMin: dto.operatingTempMin,
        operatingTempMax: dto.operatingTempMax,
        moq: dto.moq,
        sampleAvailable: dto.sampleAvailable,
        customizationAvailable: dto.customizationAvailable,
        leadTime: dto.leadTime,
        specifications: dto.specifications as Prisma.InputJsonValue,
        features: dto.features as Prisma.InputJsonValue,
        applications: dto.applications as Prisma.InputJsonValue,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex,
        published: dto.published,
        featured: dto.featured,
        sortOrder: dto.sortOrder,
      },
      include: {
        category: true,
        images: true,
        translations: true,
        variants: true,
      },
    });

    this.logger.log(`Product updated: ${product.id}`);
    return product;
  }

  async softDelete(id: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (existing.deletedAt) {
      throw new BadRequestException('Product is already deleted');
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Product soft deleted: ${product.id}`);
    return { success: true, message: 'Product deleted successfully' };
  }

  async restore(id: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (!existing.deletedAt) {
      throw new BadRequestException('Product is not deleted');
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: { deletedAt: null },
    });

    this.logger.log(`Product restored: ${product.id}`);
    return product;
  }

  // ==================== Variant API ====================

  async createVariant(productId: string, dto: CreateVariantDto) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check duplicate SKU per product
    const existing = await this.prisma.productVariant.findFirst({
      where: { productId, sku: dto.sku },
    });
    if (existing) {
      throw new ConflictException('Variant with this SKU already exists for this product');
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        sku: dto.sku,
        name: dto.name,
        nameEn: dto.nameEn,
        image: dto.image,
        nominalVoltage: dto.nominalVoltage,
        nominalCapacity: dto.nominalCapacity,
        energy: dto.energy,
        energyDensity: dto.energyDensity,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        weight: dto.weight,
        priceUsd: dto.priceUsd,
        priceUsdMin: dto.priceUsdMin,
        priceUsdMax: dto.priceUsdMax,
        published: dto.published ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    this.logger.log(`Variant created: ${variant.id} for product ${productId}`);
    return variant;
  }

  async updateVariant(productId: string, variantId: string, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    // Check SKU uniqueness if changing
    if (dto.sku && dto.sku !== variant.sku) {
      const existing = await this.prisma.productVariant.findFirst({
        where: { productId, sku: dto.sku, id: { not: variantId } },
      });
      if (existing) {
        throw new ConflictException('Variant with this SKU already exists');
      }
    }

    const updated = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        sku: dto.sku,
        name: dto.name,
        nameEn: dto.nameEn,
        image: dto.image,
        nominalVoltage: dto.nominalVoltage,
        nominalCapacity: dto.nominalCapacity,
        energy: dto.energy,
        energyDensity: dto.energyDensity,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        weight: dto.weight,
        priceUsd: dto.priceUsd,
        priceUsdMin: dto.priceUsdMin,
        priceUsdMax: dto.priceUsdMax,
        published: dto.published,
        sortOrder: dto.sortOrder,
      },
    });

    this.logger.log(`Variant updated: ${variantId}`);
    return updated;
  }

  async deleteVariant(productId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    await this.prisma.productVariant.delete({
      where: { id: variantId },
    });

    this.logger.log(`Variant deleted: ${variantId}`);
    return { success: true, message: 'Variant deleted successfully' };
  }

  // ==================== Image API ====================

  async createImage(productId: string, dto: CreateImageDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // If this image is primary, unset other primary images
    if (dto.isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const image = await this.prisma.productImage.create({
      data: {
        productId,
        url: dto.url,
        alt: dto.alt,
        altEn: dto.altEn,
        isPrimary: dto.isPrimary ?? false,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    this.logger.log(`Image created: ${image.id} for product ${productId}`);
    return image;
  }

  async updateImage(productId: string, imageId: string, dto: UpdateImageDto) {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // If setting as primary, unset other primary images
    if (dto.isPrimary === true) {
      await this.prisma.productImage.updateMany({
        where: { productId, isPrimary: true, id: { not: imageId } },
        data: { isPrimary: false },
      });
    }

    const updated = await this.prisma.productImage.update({
      where: { id: imageId },
      data: {
        url: dto.url,
        alt: dto.alt,
        altEn: dto.altEn,
        isPrimary: dto.isPrimary,
        sortOrder: dto.sortOrder,
      },
    });

    this.logger.log(`Image updated: ${imageId}`);
    return updated;
  }

  async deleteImage(productId: string, imageId: string) {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.prisma.productImage.delete({
      where: { id: imageId },
    });

    this.logger.log(`Image deleted: ${imageId}`);
    return { success: true, message: 'Image deleted successfully' };
  }

  // ==================== Translation API ====================

  async createTranslation(productId: string, dto: CreateTranslationDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check duplicate locale
    const existing = await this.prisma.productTranslation.findFirst({
      where: { productId, locale: dto.locale },
    });
    if (existing) {
      throw new ConflictException('Translation for this locale already exists');
    }

    const translation = await this.prisma.productTranslation.create({
      data: {
        productId,
        locale: dto.locale,
        name: dto.name,
        shortDescription: dto.shortDescription,
        description: dto.description,
        features: dto.features as Prisma.InputJsonValue,
        technicalNotes: dto.technicalNotes,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
    });

    this.logger.log(`Translation created: ${translation.id} for product ${productId}`);
    return translation;
  }

  async updateTranslation(productId: string, locale: string, dto: UpdateTranslationDto) {
    const translation = await this.prisma.productTranslation.findFirst({
      where: { productId, locale },
    });
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    const updated = await this.prisma.productTranslation.update({
      where: { id: translation.id },
      data: {
        name: dto.name,
        shortDescription: dto.shortDescription,
        description: dto.description,
        features: dto.features as Prisma.InputJsonValue,
        technicalNotes: dto.technicalNotes,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
      },
    });

    this.logger.log(`Translation updated: ${translation.id}`);
    return updated;
  }

  async deleteTranslation(productId: string, locale: string) {
    const translation = await this.prisma.productTranslation.findFirst({
      where: { productId, locale },
    });
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    await this.prisma.productTranslation.delete({
      where: { id: translation.id },
    });

    this.logger.log(`Translation deleted: ${translation.id}`);
    return { success: true, message: 'Translation deleted successfully' };
  }

  // ==================== Helpers ====================

  private transformProductForResponse(product: any, locale: string) {
    const translation = product.translations?.[0];
    const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];

    return {
      id: product.id,
      sku: product.sku,
      model: product.model,
      slug: product.slug,
      category: product.category ? {
        id: product.category.id,
        slug: product.category.slug,
        icon: product.category.icon,
      } : null,
      brand: product.brand,
      chemistry: product.chemistry,
      // Use translation or fallback
      name: translation?.name || product.model,
      shortDescription: translation?.shortDescription || product.shortDescription,
      description: translation?.description || product.description,
      // Specs
      nominalVoltage: product.nominalVoltage,
      nominalCapacity: product.nominalCapacity,
      energy: product.energy,
      energyDensity: product.energyDensity,
      weight: product.weight,
      // Price range from variants
      priceRange: this.calculatePriceRange(product.variants),
      // Image
      image: primaryImage ? {
        url: primaryImage.url,
        alt: locale === 'en' ? primaryImage.altEn : primaryImage.alt,
      } : null,
      // Stats
      variantCount: product.variants?.length || 0,
      // SEO
      seoTitle: translation?.seoTitle || product.seoTitle,
      seoDescription: translation?.seoDescription || product.seoDescription,
      // Status
      published: product.published,
      featured: product.featured,
      // Timestamps
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private transformProductDetailForResponse(product: any, locale: string): any {
    const translation = product.translations?.[0];

    return {
      id: product.id,
      sku: product.sku,
      model: product.model,
      slug: product.slug,
      category: product.category,
      brand: product.brand,
      chemistry: product.chemistry,
      // Translation content
      name: translation?.name || product.model,
      shortDescription: translation?.shortDescription || product.shortDescription,
      description: translation?.description || product.description,
      features: translation?.features || product.features,
      technicalNotes: translation?.technicalNotes || product.technicalNotes,
      // All specs
      nominalVoltage: product.nominalVoltage,
      nominalCapacity: product.nominalCapacity,
      energy: product.energy,
      energyDensity: product.energyDensity,
      chargeRate: product.chargeRate,
      dischargeRate: product.dischargeRate,
      peakDischargeRate: product.peakDischargeRate,
      length: product.length,
      width: product.width,
      height: product.height,
      weight: product.weight,
      cycleLife: product.cycleLife,
      operatingTempMin: product.operatingTempMin,
      operatingTempMax: product.operatingTempMax,
      // Business terms
      moq: product.moq,
      sampleAvailable: product.sampleAvailable,
      customizationAvailable: product.customizationAvailable,
      leadTime: product.leadTime,
      // Extended specs
      specifications: product.specifications,
      // Applications
      applications: product.productApplications?.map((pa: any) => ({
        id: pa.application.id,
        slug: pa.application.slug,
        name: pa.application.name,
        icon: pa.application.icon,
        color: pa.application.color,
      })),
      // Variants
      variants: product.variants?.map((v: any) => this.transformVariant(v, product)),
      // Images
      images: product.images?.map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: locale === 'en' ? img.altEn : img.alt,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      // SEO
      seoTitle: translation?.seoTitle || product.seoTitle,
      seoDescription: translation?.seoDescription || product.seoDescription,
      canonicalUrl: product.canonicalUrl,
      noIndex: product.noIndex,
      // Status
      published: product.published,
      featured: product.featured,
      sortOrder: product.sortOrder,
      // Timestamps
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private transformVariant(variant: any, product: any): any {
    return {
      id: variant.id,
      sku: variant.sku,
      name: variant.name || product.model,
      nameEn: variant.nameEn,
      image: variant.image,
      // Override from variant or fallback to product
      nominalVoltage: variant.nominalVoltage ?? product.nominalVoltage,
      nominalCapacity: variant.nominalCapacity ?? product.nominalCapacity,
      energy: variant.energy ?? product.energy,
      energyDensity: variant.energyDensity ?? product.energyDensity,
      length: variant.length ?? product.length,
      width: variant.width ?? product.width,
      height: variant.height ?? product.height,
      weight: variant.weight ?? product.weight,
      // Extended specs (JSON: chargeRate, dischargeRate, dimensions, cycleLife...)
      specifications: variant.specifications,
      // Price
      priceUsd: variant.priceUsd,
      priceUsdMin: variant.priceUsdMin,
      priceUsdMax: variant.priceUsdMax,
      // Status
      published: variant.published,
      sortOrder: variant.sortOrder,
    };
  }

  private calculatePriceRange(variants: any[]) {
    if (!variants || variants.length === 0) {
      return null;
    }

    const prices = variants
      .flatMap((v) => [v.priceUsd, v.priceUsdMin, v.priceUsdMax])
      .filter((p) => p !== null && p !== undefined);

    if (prices.length === 0) {
      return null;
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}
