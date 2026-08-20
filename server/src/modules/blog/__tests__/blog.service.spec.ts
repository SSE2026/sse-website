import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from '../services/blog.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

// Mock Prisma Service
const mockPrisma = {
  blogCategory: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  blogCategoryTranslation: {
    create: jest.fn(),
    upsert: jest.fn(),
  },
  blogPost: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  blogPostTranslation: {
    create: jest.fn(),
    upsert: jest.fn(),
  },
};

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  // ==================== Categories ====================

  describe('createCategory', () => {
    it('should create a category with default English translation', async () => {
      const mockCategory = {
        id: 'cat_123',
        slug: 'technology',
        sortOrder: 0,
        createdAt: new Date(),
        translations: [{ locale: 'en', name: 'Technology' }],
      };

      mockPrisma.blogCategory.create.mockResolvedValue(mockCategory);
      mockPrisma.blogCategoryTranslation.create.mockResolvedValue({ id: 't_1' });

      const result = await service.createCategory({
        slug: 'technology',
        name: 'Technology',
      });

      expect(result.id).toBe('cat_123');
      expect(result.slug).toBe('technology');
    });

    it('should create category with Chinese translation', async () => {
      const mockCategory = {
        id: 'cat_123',
        slug: 'technology',
        sortOrder: 0,
        createdAt: new Date(),
        translations: [],
      };

      mockPrisma.blogCategory.create.mockResolvedValue(mockCategory);
      mockPrisma.blogCategoryTranslation.create.mockResolvedValue({ id: 't_1' });

      await service.createCategory({
        slug: 'technology',
        name: 'Technology',
        nameZh: '技术',
      });

      expect(mockPrisma.blogCategoryTranslation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          locale: 'zh-CN',
          name: '技术',
        }),
      });
    });
  });

  describe('findAllCategories', () => {
    it('should return categories with fallback translation', async () => {
      const mockCategories = [
        {
          id: 'cat_123',
          slug: 'technology',
          sortOrder: 0,
          translations: [
            { locale: 'en', name: 'Technology' },
          ],
          posts: [{ id: 'post_1' }],
        },
        {
          id: 'cat_456',
          slug: 'news',
          sortOrder: 1,
          translations: [], // No translation, should fallback
          posts: [],
        },
      ];

      mockPrisma.blogCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.findAllCategories('de'); // German not available

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Technology');
    });

    it('should return published post count per category', async () => {
      const mockCategories = [
        {
          id: 'cat_123',
          slug: 'technology',
          sortOrder: 0,
          translations: [{ locale: 'en', name: 'Tech' }],
          posts: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }], // 3 published posts
        },
      ];

      mockPrisma.blogCategory.findMany.mockResolvedValue(mockCategories);

      const result = await service.findAllCategories();

      expect(result[0].postCount).toBe(3);
    });
  });

  describe('findCategoryById', () => {
    it('should return category with translations', async () => {
      const mockCategory = {
        id: 'cat_123',
        slug: 'technology',
        translations: [
          { locale: 'en', name: 'Technology', description: 'Tech news' },
          { locale: 'zh-CN', name: '技术', description: '技术新闻' },
        ],
      };

      mockPrisma.blogCategory.findUnique.mockResolvedValue(mockCategory);

      const result = await service.findCategoryById('cat_123');

      expect(result.id).toBe('cat_123');
      expect(result.translations).toHaveLength(2);
    });

    it('should throw NotFoundException for non-existent category', async () => {
      mockPrisma.blogCategory.findUnique.mockResolvedValue(null);

      await expect(service.findCategoryById('non_existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCategory', () => {
    it('should update category slug', async () => {
      mockPrisma.blogCategory.findUnique.mockResolvedValue({
        id: 'cat_123',
        slug: 'technology',
      });
      mockPrisma.blogCategory.update.mockResolvedValue({
        id: 'cat_123',
        slug: 'tech-updated',
        sortOrder: 0,
        updatedAt: new Date(),
      });

      const result = await service.updateCategory('cat_123', { slug: 'tech-updated' });

      expect(result.slug).toBe('tech-updated');
    });

    it('should create/update Chinese translation', async () => {
      mockPrisma.blogCategory.findUnique.mockResolvedValue({
        id: 'cat_123',
        slug: 'technology',
      });
      mockPrisma.blogCategory.update.mockResolvedValue({
        id: 'cat_123',
        slug: 'technology',
        sortOrder: 0,
        updatedAt: new Date(),
      });
      mockPrisma.blogCategoryTranslation.upsert.mockResolvedValue({ id: 't_1' });

      await service.updateCategory('cat_123', { nameZh: '技术更新' });

      expect(mockPrisma.blogCategoryTranslation.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoryId_locale: { categoryId: 'cat_123', locale: 'zh-CN' } },
        }),
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete empty category', async () => {
      mockPrisma.blogCategory.findUnique.mockResolvedValue({
        id: 'cat_123',
        posts: [],
      });
      mockPrisma.blogCategory.delete.mockResolvedValue({ id: 'cat_123' });

      const result = await service.deleteCategory('cat_123');

      expect(result.success).toBe(true);
      expect(mockPrisma.blogCategory.delete).toHaveBeenCalled();
    });

    it('should unlink posts before deleting non-empty category', async () => {
      mockPrisma.blogCategory.findUnique.mockResolvedValue({
        id: 'cat_123',
        posts: [{ id: 'post_1' }],
      });
      mockPrisma.blogPost.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.blogCategory.delete.mockResolvedValue({ id: 'cat_123' });

      await service.deleteCategory('cat_123');

      expect(mockPrisma.blogPost.updateMany).toHaveBeenCalledWith({
        where: { categoryId: 'cat_123' },
        data: { categoryId: null },
      });
    });
  });

  // ==================== Blog Posts ====================

  describe('create', () => {
    it('should create a blog post with primary translation', async () => {
      const mockPost = {
        id: 'post_123',
        slug: 'battery-breakthrough',
        published: false,
        createdAt: new Date(),
      };

      mockPrisma.blogPost.create.mockResolvedValue(mockPost);

      const result = await service.create({
        slug: 'battery-breakthrough',
        title: 'New Battery Breakthrough',
        excerpt: 'An exciting development...',
        content: '<p>Full article...</p>',
      });

      expect(result.id).toBe('post_123');
      expect(result.slug).toBe('battery-breakthrough');
      // Primary translation is created via nested create in blogPost.create
      expect(mockPrisma.blogPost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            translations: expect.objectContaining({
              create: expect.objectContaining({
                locale: 'en',
                title: 'New Battery Breakthrough',
              }),
            }),
          }),
        }),
      );
    });

    it('should create post with Chinese translation', async () => {
      const mockPost = {
        id: 'post_123',
        slug: 'battery-breakthrough',
        published: false,
        createdAt: new Date(),
      };

      mockPrisma.blogPost.create.mockResolvedValue(mockPost);
      mockPrisma.blogPostTranslation.create.mockResolvedValue({ id: 't_1' });

      await service.create({
        slug: 'battery-breakthrough',
        title: 'New Battery Breakthrough',
        titleZh: '电池技术新突破',
        contentZh: '<p>全文...</p>',
      });

      // Primary translation is nested, Chinese translation is created separately
      expect(mockPrisma.blogPostTranslation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          locale: 'zh-CN',
          title: '电池技术新突破',
        }),
      });
    });
  });

  describe('findAllPublished', () => {
    it('should return only published posts', async () => {
      const mockPosts = [
        {
          id: 'post_1',
          slug: 'post-one',
          excerpt: 'Excerpt 1',
          coverImage: null,
          authorName: 'Author',
          tags: ['tech'],
          publishedAt: new Date('2026-01-01'),
          viewCount: 100,
          seoTitle: null,
          seoDescription: null,
          canonicalUrl: null,
          noIndex: false,
          category: null,
          translations: [{ locale: 'en', title: 'Post One', excerpt: 'Excerpt 1' }],
        },
      ];

      mockPrisma.blogPost.findMany.mockResolvedValue(mockPosts);
      mockPrisma.blogPost.count.mockResolvedValue(1);

      const result = await service.findAllPublished({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Post One');
      expect(result.meta.total).toBe(1);
    });

    it('should filter by category', async () => {
      mockPrisma.blogPost.findMany.mockResolvedValue([]);
      mockPrisma.blogPost.count.mockResolvedValue(0);

      await service.findAllPublished({ page: 1, limit: 10, category: 'technology' });

      expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { slug: 'technology' },
          }),
        }),
      );
    });

    it('should filter by featured', async () => {
      mockPrisma.blogPost.findMany.mockResolvedValue([]);
      mockPrisma.blogPost.count.mockResolvedValue(0);

      await service.findAllPublished({ page: 1, limit: 10, featured: true });

      expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            featured: true,
          }),
        }),
      );
    });
  });

  describe('findBySlug', () => {
    it('should return post with translation fallback', async () => {
      const mockPost = {
        id: 'post_123',
        slug: 'battery-breakthrough',
        excerpt: 'English excerpt',
        content: 'English content',
        coverImage: null,
        authorName: 'Author',
        tags: ['tech'],
        publishedAt: new Date(),
        viewCount: 50,
        seoTitle: null,
        seoDescription: null,
        canonicalUrl: '/blog/battery',
        noIndex: false,
        deletedAt: null,
        category: {
          slug: 'technology',
          translations: [{ locale: 'en', name: 'Technology' }],
        },
        translations: [
          { locale: 'en', title: 'Battery Breakthrough', excerpt: 'English excerpt' },
          { locale: 'zh-CN', title: '电池突破', excerpt: '中文摘要' },
        ],
      };

      mockPrisma.blogPost.findUnique.mockResolvedValue(mockPost);
      mockPrisma.blogPost.update.mockResolvedValue(mockPost);

      const result = await service.findBySlug('battery-breakthrough', 'en');

      expect(result.title).toBe('Battery Breakthrough');
      expect(result.content).toBe('English content');
    });

    it('should fallback to English when locale translation missing', async () => {
      const mockPost = {
        id: 'post_123',
        slug: 'battery-breakthrough',
        excerpt: 'English excerpt',
        content: 'English content',
        coverImage: null,
        authorName: 'Author',
        tags: [],
        publishedAt: new Date(),
        viewCount: 50,
        seoTitle: null,
        seoDescription: null,
        canonicalUrl: null,
        noIndex: false,
        deletedAt: null,
        category: null,
        translations: [
          { locale: 'en', title: 'Battery Breakthrough', excerpt: 'English excerpt' },
          // No zh-CN translation
        ],
      };

      mockPrisma.blogPost.findUnique.mockResolvedValue(mockPost);
      mockPrisma.blogPost.update.mockResolvedValue(mockPost);

      const result = await service.findBySlug('battery-breakthrough', 'zh-CN');

      // Should fallback to English
      expect(result.title).toBe('Battery Breakthrough');
    });

    it('should throw NotFoundException for deleted post', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue({
        id: 'post_123',
        deletedAt: new Date(),
      });

      await expect(service.findBySlug('deleted-post')).rejects.toThrow(NotFoundException);
    });

    it('should increment view count', async () => {
      const mockPost = {
        id: 'post_123',
        slug: 'popular-post',
        excerpt: 'Test',
        content: 'Content',
        coverImage: null,
        authorName: 'Author',
        tags: [],
        publishedAt: new Date(),
        viewCount: 100,
        seoTitle: null,
        seoDescription: null,
        canonicalUrl: null,
        noIndex: false,
        deletedAt: null,
        category: null,
        translations: [
          { locale: 'en', title: 'Popular Post', excerpt: 'Test' },
        ],
      };

      mockPrisma.blogPost.findUnique.mockResolvedValue(mockPost);
      mockPrisma.blogPost.update.mockResolvedValue({ ...mockPost, viewCount: 101 });

      await service.findBySlug('popular-post');

      expect(mockPrisma.blogPost.update).toHaveBeenCalledWith({
        where: { id: 'post_123' },
        data: { viewCount: { increment: 1 } },
      });
    });

    it('should include SEO fields in response', async () => {
      const mockPost = {
        id: 'post_123',
        slug: 'seo-post',
        excerpt: 'Test',
        content: 'Content',
        coverImage: null,
        authorName: 'Author',
        tags: [],
        publishedAt: new Date(),
        viewCount: 0,
        seoTitle: 'Custom SEO Title',
        seoDescription: 'Custom SEO Description',
        canonicalUrl: '/blog/seo-post',
        noIndex: true,
        deletedAt: null,
        category: null,
        translations: [
          { locale: 'en', title: 'SEO Post', excerpt: 'Test' },
        ],
      };

      mockPrisma.blogPost.findUnique.mockResolvedValue(mockPost);
      mockPrisma.blogPost.update.mockResolvedValue(mockPost);

      const result = await service.findBySlug('seo-post');

      expect(result.seo.title).toBe('Custom SEO Title');
      expect(result.seo.description).toBe('Custom SEO Description');
      expect(result.seo.noIndex).toBe(true);
    });
  });

  describe('findById (Admin)', () => {
    it('should return post with all translations', async () => {
      const mockPost = {
        id: 'post_123',
        slug: 'test-post',
        excerpt: 'Excerpt',
        content: 'Content',
        coverImage: null,
        authorName: 'Author',
        categoryId: 'cat_123',
        tags: ['tech'],
        published: true,
        featured: false,
        publishedAt: new Date(),
        viewCount: 50,
        seoTitle: null,
        seoDescription: null,
        canonicalUrl: null,
        noIndex: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        translations: [
          { locale: 'en', title: 'Test Post', excerpt: 'Excerpt', content: 'Content', seoTitle: null, seoDescription: null },
          { locale: 'zh-CN', title: '测试文章', excerpt: '摘要', content: '内容', seoTitle: null, seoDescription: null },
        ],
      };

      mockPrisma.blogPost.findUnique.mockResolvedValue(mockPost);

      const result = await service.findById('post_123');

      expect(result.translations).toHaveLength(2);
      expect(result.translations.find(t => t.locale === 'zh-CN')?.title).toBe('测试文章');
    });
  });

  describe('update', () => {
    it('should update post and translations', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue({
        id: 'post_123',
        slug: 'old-slug',
        coverImage: null,
        authorName: 'Author',
        categoryId: null,
        tags: [],
        noIndex: false,
        published: false,
        featured: false,
        publishedAt: null,
      });
      mockPrisma.blogPost.update.mockResolvedValue({
        id: 'post_123',
        slug: 'new-slug',
        published: true,
        updatedAt: new Date(),
      });
      mockPrisma.blogPostTranslation.upsert.mockResolvedValue({ id: 't_1' });

      const result = await service.update('post_123', {
        slug: 'new-slug',
        published: true,
        title: 'Updated Title',
      });

      expect(result.slug).toBe('new-slug');
      expect(mockPrisma.blogPostTranslation.upsert).toHaveBeenCalled();
    });

    it('should update Chinese translation', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue({
        id: 'post_123',
        slug: 'test',
        coverImage: null,
        authorName: 'Author',
        categoryId: null,
        tags: [],
        noIndex: false,
        published: false,
        featured: false,
        publishedAt: null,
      });
      mockPrisma.blogPost.update.mockResolvedValue({
        id: 'post_123',
        slug: 'test',
        published: false,
        updatedAt: new Date(),
      });
      mockPrisma.blogPostTranslation.upsert.mockResolvedValue({ id: 't_1' });

      await service.update('post_123', {
        titleZh: '中文标题更新',
        contentZh: '中文内容更新',
      });

      expect(mockPrisma.blogPostTranslation.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { blogPostId_locale: { blogPostId: 'post_123', locale: 'zh-CN' } },
        }),
      );
    });
  });

  describe('delete', () => {
    it('should soft delete blog post', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue({
        id: 'post_123',
        deletedAt: null,
      });
      mockPrisma.blogPost.update.mockResolvedValue({
        id: 'post_123',
        deletedAt: new Date(),
      });

      const result = await service.delete('post_123');

      expect(result.success).toBe(true);
      expect(mockPrisma.blogPost.update).toHaveBeenCalledWith({
        where: { id: 'post_123' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException for non-existent post', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue(null);

      await expect(service.delete('non_existent')).rejects.toThrow(NotFoundException);
    });
  });
});
