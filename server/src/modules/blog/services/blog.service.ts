import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  QueryBlogPostDto,
  buildBlogPostWhere,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from '../dto';
import { Prisma } from '@prisma/client';

/**
 * Blog Service
 * Handles CRUD operations for blog posts and categories
 */
@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);
  private readonly defaultLocale = 'en';

  constructor(private readonly prisma: PrismaService) {}

  // ==================== Blog Categories ====================

  /**
   * Create a blog category
   */
  async createCategory(dto: CreateBlogCategoryDto): Promise<{
    id: string;
    slug: string;
    sortOrder: number;
    createdAt: Date;
  }> {
    const category = await this.prisma.blogCategory.create({
      data: {
        slug: dto.slug,
        sortOrder: dto.sortOrder ?? 0,
        translations: dto.name
          ? {
              create: {
                locale: this.defaultLocale,
                name: dto.name,
                description: dto.description,
              },
            }
          : undefined,
      },
      include: {
        translations: true,
      },
    });

    // Create additional translations
    if (dto.nameZh) {
      await this.prisma.blogCategoryTranslation.create({
        data: {
          categoryId: category.id,
          locale: 'zh-CN',
          name: dto.nameZh,
        },
      });
    }

    this.logger.log(`Blog category created: ${category.id}`);

    return {
      id: category.id,
      slug: category.slug,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
    };
  }

  /**
   * Find all categories with translations
   */
  async findAllCategories(locale?: string): Promise<
    Array<{
      id: string;
      slug: string;
      name: string;
      description: string | null;
      postCount: number;
      sortOrder: number;
    }>
  > {
    const targetLocale = locale || this.defaultLocale;

    const categories = await this.prisma.blogCategory.findMany({
      include: {
        translations: {
          where: {
            locale: { in: [targetLocale, this.defaultLocale] },
          },
          orderBy: {
            locale: 'asc', // prefer specific locale over default
          },
        },
        posts: {
          where: {
            published: true,
            deletedAt: null,
            OR: [{ publishedAt: { lte: new Date() } }, { publishedAt: null }],
          },
          select: { id: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((cat) => {
      const translation = cat.translations[0];
      return {
        id: cat.id,
        slug: cat.slug,
        name: translation?.name || cat.slug,
        description: translation?.description || null,
        postCount: cat.posts.length,
        sortOrder: cat.sortOrder,
      };
    });
  }

  /**
   * Find category by ID
   */
  async findCategoryById(id: string, locale?: string): Promise<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    translations: Array<{ locale: string; name: string; description: string | null }>;
  }> {
    const targetLocale = locale || this.defaultLocale;

    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Get primary translation
    const primaryTranslation = category.translations.find((t) => t.locale === targetLocale)
      || category.translations.find((t) => t.locale === this.defaultLocale)
      || category.translations[0];

    return {
      id: category.id,
      slug: category.slug,
      name: primaryTranslation?.name || category.slug,
      description: primaryTranslation?.description || null,
      translations: category.translations.map((t) => ({
        locale: t.locale,
        name: t.name,
        description: t.description,
      })),
    };
  }

  /**
   * Update blog category
   */
  async updateCategory(id: string, dto: UpdateBlogCategoryDto): Promise<{
    id: string;
    slug: string;
    sortOrder: number;
    updatedAt: Date;
  }> {
    const existing = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    // Update category
    const category = await this.prisma.blogCategory.update({
      where: { id },
      data: {
        slug: dto.slug ?? existing.slug,
        sortOrder: dto.sortOrder ?? existing.sortOrder,
      },
    });

    // Update translations
    if (dto.name) {
      await this.prisma.blogCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: id, locale: this.defaultLocale } },
        update: { name: dto.name, description: dto.description },
        create: { categoryId: id, locale: this.defaultLocale, name: dto.name, description: dto.description },
      });
    }

    if (dto.nameZh) {
      await this.prisma.blogCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: id, locale: 'zh-CN' } },
        update: { name: dto.nameZh },
        create: { categoryId: id, locale: 'zh-CN', name: dto.nameZh },
      });
    }

    this.logger.log(`Blog category updated: ${id}`);

    return {
      id: category.id,
      slug: category.slug,
      sortOrder: category.sortOrder,
      updatedAt: category.updatedAt,
    };
  }

  /**
   * Delete blog category
   */
  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.blogCategory.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    if (existing.posts.length > 0) {
      // Just unlink posts, don't delete them
      await this.prisma.blogPost.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      });
    }

    await this.prisma.blogCategory.delete({ where: { id } });

    this.logger.log(`Blog category deleted: ${id}`);

    return { success: true };
  }

  // ==================== Blog Posts ====================

  /**
   * Create a blog post
   */
  async create(dto: CreateBlogPostDto): Promise<{
    id: string;
    slug: string;
    published: boolean;
    createdAt: Date;
  }> {
    const post = await this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        coverImage: dto.coverImage,
        authorName: dto.authorName,
        categoryId: dto.categoryId,
        tags: dto.tags || [],
        excerpt: dto.excerpt,
        content: dto.content,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex ?? false,
        published: dto.published ?? false,
        featured: dto.featured ?? false,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
        // Primary translation (English)
        translations: {
          create: {
            locale: this.defaultLocale,
            title: dto.title,
            excerpt: dto.excerpt,
            content: dto.content,
            seoTitle: dto.seoTitle,
            seoDescription: dto.seoDescription,
          },
        },
      },
    });

    // Create Chinese translation if provided
    if (dto.titleZh || dto.contentZh) {
      await this.prisma.blogPostTranslation.create({
        data: {
          blogPostId: post.id,
          locale: 'zh-CN',
          title: dto.titleZh || dto.title,
          excerpt: dto.excerptZh || dto.excerpt,
          content: dto.contentZh || dto.content,
          seoTitle: dto.seoTitleZh || dto.seoTitle,
          seoDescription: dto.seoDescriptionZh || dto.seoDescription,
        },
      });
    }

    this.logger.log(`Blog post created: ${post.id}`);

    return {
      id: post.id,
      slug: post.slug,
      published: post.published,
      createdAt: post.createdAt,
    };
  }

  /**
   * Find all published blog posts (Public API)
   */
  async findAllPublished(query: QueryBlogPostDto, locale?: string): Promise<{
    items: Array<{
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      coverImage: string | null;
      authorName: string | null;
      category: { id: string; slug: string; name: string } | null;
      tags: string[];
      publishedAt: Date | null;
      viewCount: number;
      seo: { title: string | null; description: string | null; canonicalUrl: string | null; noIndex: boolean };
    }>;
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const targetLocale = locale || this.defaultLocale;

    const where = buildBlogPostWhere(query);
    // Only show published posts with publishedAt <= now
    where.published = true;
    where.deletedAt = null;
    where.OR = [
      { publishedAt: { lte: new Date() } },
      { publishedAt: null },
    ];

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'publishedAt']: query.sortOrder || 'desc' },
        include: {
          category: {
            include: {
              translations: {
                where: { locale: { in: [targetLocale, this.defaultLocale] } },
                orderBy: { locale: 'asc' },
                take: 1,
              },
            },
          },
          translations: {
            where: { locale: { in: [targetLocale, this.defaultLocale] } },
            orderBy: { locale: 'asc' },
            take: 1,
          },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      items: posts.map((post) => {
        const translation = post.translations[0];
        const categoryTranslation = post.category?.translations[0];
        return {
          id: post.id,
          slug: post.slug,
          title: translation?.title || post.slug,
          excerpt: translation?.excerpt || post.excerpt,
          coverImage: post.coverImage,
          authorName: post.authorName,
          category: post.category
            ? {
                id: post.category.id,
                slug: post.category.slug,
                name: categoryTranslation?.name || post.category.slug,
              }
            : null,
          tags: post.tags,
          publishedAt: post.publishedAt,
          viewCount: post.viewCount,
          seo: {
            title: translation?.seoTitle || post.seoTitle,
            description: translation?.seoDescription || post.seoDescription,
            canonicalUrl: post.canonicalUrl,
            noIndex: post.noIndex,
          },
        };
      }),
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find all blog posts (Admin API)
   */
  async findAll(query: QueryBlogPostDto): Promise<{
    items: Array<{
      id: string;
      slug: string;
      title: string;
      published: boolean;
      featured: boolean;
      publishedAt: Date | null;
      viewCount: number;
      category: { id: string; slug: string } | null;
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

    const where: Prisma.BlogPostWhereInput = {
      deletedAt: null,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.search) {
      where.OR = [
        { slug: { contains: query.search, mode: 'insensitive' } },
        { translations: { some: { title: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        include: {
          category: {
            select: { id: true, slug: true },
          },
          translations: {
            where: { locale: this.defaultLocale },
            take: 1,
          },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      items: posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.translations[0]?.title || post.slug,
        published: post.published,
        featured: post.featured,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount,
        category: post.category ? { id: post.category.id, slug: post.category.slug } : null,
        createdAt: post.createdAt,
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
   * Find blog post by slug (Public API)
   */
  async findBySlug(slug: string, locale?: string): Promise<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    coverImage: string | null;
    authorName: string | null;
    category: { id: string; slug: string; name: string } | null;
    tags: string[];
    publishedAt: Date | null;
    viewCount: number;
    seo: {
      title: string | null;
      description: string | null;
      canonicalUrl: string | null;
      noIndex: boolean;
    };
    translations: Array<{
      locale: string;
      title: string;
      excerpt: string | null;
      content: string | null;
    }>;
  }> {
    const targetLocale = locale || this.defaultLocale;

    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            translations: {
              where: { locale: { in: [targetLocale, this.defaultLocale] } },
              orderBy: { locale: 'asc' },
              take: 1,
            },
          },
        },
        translations: true,
      },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException('Blog post not found');
    }

    // Check if published (for public access)
    // Admin can access all posts

    // Get primary translation with fallback
    const primaryTranslation =
      post.translations.find((t) => t.locale === targetLocale)
      || post.translations.find((t) => t.locale === this.defaultLocale)
      || post.translations[0];

    const categoryTranslation = post.category?.translations[0];

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      id: post.id,
      slug: post.slug,
      title: primaryTranslation?.title || post.slug,
      excerpt: primaryTranslation?.excerpt || post.excerpt,
      content: primaryTranslation?.content || post.content,
      coverImage: post.coverImage,
      authorName: post.authorName,
      category: post.category
        ? {
            id: post.category.id,
            slug: post.category.slug,
            name: categoryTranslation?.name || post.category.slug,
          }
        : null,
      tags: post.tags,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount + 1,
      seo: {
        title: primaryTranslation?.seoTitle || post.seoTitle,
        description: primaryTranslation?.seoDescription || post.seoDescription,
        canonicalUrl: post.canonicalUrl,
        noIndex: post.noIndex,
      },
      translations: post.translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        excerpt: t.excerpt,
        content: t.content,
      })),
    };
  }

  /**
   * Find blog post by ID (Admin)
   */
  async findById(id: string): Promise<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    coverImage: string | null;
    authorName: string | null;
    categoryId: string | null;
    tags: string[];
    published: boolean;
    featured: boolean;
    publishedAt: Date | null;
    viewCount: number;
    seo: {
      title: string | null;
      description: string | null;
      canonicalUrl: string | null;
      noIndex: boolean;
    };
    translations: Array<{
      locale: string;
      title: string;
      excerpt: string | null;
      content: string | null;
      seoTitle: string | null;
      seoDescription: string | null;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    const primaryTranslation = post.translations.find((t) => t.locale === this.defaultLocale);

    return {
      id: post.id,
      slug: post.slug,
      title: primaryTranslation?.title || post.slug,
      excerpt: primaryTranslation?.excerpt || post.excerpt,
      content: primaryTranslation?.content || post.content,
      coverImage: post.coverImage,
      authorName: post.authorName,
      categoryId: post.categoryId,
      tags: post.tags,
      published: post.published,
      featured: post.featured,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      seo: {
        title: primaryTranslation?.seoTitle || post.seoTitle,
        description: primaryTranslation?.seoDescription || post.seoDescription,
        canonicalUrl: post.canonicalUrl,
        noIndex: post.noIndex,
      },
      translations: post.translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        excerpt: t.excerpt,
        content: t.content,
        seoTitle: t.seoTitle,
        seoDescription: t.seoDescription,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  /**
   * Update blog post
   */
  async update(id: string, dto: UpdateBlogPostDto): Promise<{
    id: string;
    slug: string;
    published: boolean;
    updatedAt: Date;
  }> {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Blog post not found');
    }

    // Update post
    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        slug: dto.slug ?? existing.slug,
        coverImage: dto.coverImage ?? existing.coverImage,
        authorName: dto.authorName ?? existing.authorName,
        categoryId: dto.categoryId !== undefined ? dto.categoryId : existing.categoryId,
        tags: dto.tags ?? existing.tags,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex ?? existing.noIndex,
        published: dto.published ?? existing.published,
        featured: dto.featured ?? existing.featured,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : existing.publishedAt,
      },
    });

    // Update primary translation (English)
    if (dto.title || dto.excerpt !== undefined || dto.content !== undefined) {
      await this.prisma.blogPostTranslation.upsert({
        where: {
          blogPostId_locale: { blogPostId: id, locale: this.defaultLocale },
        },
        update: {
          title: dto.title,
          excerpt: dto.excerpt,
          content: dto.content,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
        },
        create: {
          blogPostId: id,
          locale: this.defaultLocale,
          title: dto.title || existing.slug,
          excerpt: dto.excerpt,
          content: dto.content,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
        },
      });
    }

    // Update Chinese translation
    if (dto.titleZh || dto.excerptZh !== undefined || dto.contentZh !== undefined) {
      await this.prisma.blogPostTranslation.upsert({
        where: {
          blogPostId_locale: { blogPostId: id, locale: 'zh-CN' },
        },
        update: {
          title: dto.titleZh,
          excerpt: dto.excerptZh,
          content: dto.contentZh,
          seoTitle: dto.seoTitleZh,
          seoDescription: dto.seoDescriptionZh,
        },
        create: {
          blogPostId: id,
          locale: 'zh-CN',
          title: dto.titleZh || dto.title || existing.slug,
          excerpt: dto.excerptZh || dto.excerpt,
          content: dto.contentZh || dto.content,
          seoTitle: dto.seoTitleZh || dto.seoTitle,
          seoDescription: dto.seoDescriptionZh || dto.seoDescription,
        },
      });
    }

    this.logger.log(`Blog post updated: ${id}`);

    return {
      id: post.id,
      slug: post.slug,
      published: post.published,
      updatedAt: post.updatedAt,
    };
  }

  /**
   * Soft delete blog post
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Blog post not found');
    }

    await this.prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Blog post soft deleted: ${id}`);

    return { success: true };
  }
}
