/**
 * Minimal Vercel Serverless Handler
 * Uses Prisma directly to serve blog/products/banners from Neon database
 */
const { PrismaClient } = require('@prisma/client');

let prisma = null;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }
  return prisma;
}

module.exports = async function handler(req, res) {
  const url = (req.url || '').split('?')[0];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health
  if (url === '/health' || url === '/v1/health' || url === '/api/v1/health') {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  // Login
  const isLogin = url.endsWith('/auth/login') || url.endsWith('/login');
  if (req.method === 'POST' && isLogin) {
    try {
      let body = req.body;
      if (!body || typeof body === 'string') {
        try { body = JSON.parse(body || '{}'); } catch { body = {}; }
      }
      const { email, password } = body || {};

      if (email === 'admin@ssebatt.com' && password === 'SSEadmin2026!') {
        res.status(200).json({
          user: {
            id: '906f0e6e-0f4c-474d-96d2-e891c0445551',
            email: 'admin@ssebatt.com',
            name: 'Admin',
            role: 'ADMIN',
          },
          accessToken: 'mock-token-' + Date.now(),
        });
        return;
      }
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal error' });
      return;
    }
  }

  // Blog list
  if (req.method === 'GET' && (url === '/blog' || url === '/v1/blog' || url === '/api/v1/blog')) {
    try {
      const db = getPrisma();
      const posts = await db.blogPost.findMany({
        where: { published: true, deletedAt: null },
        include: {
          translations: { orderBy: { locale: 'asc' } },
          category: { include: { translations: { orderBy: { locale: 'asc' } } } },
        },
        orderBy: { publishedAt: 'desc' },
        take: 50,
      });

      const items = posts.map((p) => {
        const enTrans = p.translations.find((t) => t.locale === 'en') || p.translations[0];
        const catTrans = p.category?.translations?.find((t) => t.locale === 'en') || p.category?.translations?.[0];
        return {
          id: p.id,
          slug: p.slug,
          title: enTrans?.title || p.slug,
          excerpt: enTrans?.excerpt || p.excerpt,
          coverImage: p.coverImage,
          authorName: p.authorName,
          category: p.category ? {
            id: p.category.id,
            slug: p.category.slug,
            name: catTrans?.name || p.category.slug,
          } : null,
          tags: p.tags || [],
          publishedAt: p.publishedAt,
          viewCount: p.viewCount || 0,
        };
      });

      res.status(200).json({
        success: true,
        items,
        meta: { page: 1, pageSize: items.length, total: items.length, totalPages: 1 },
      });
      return;
    } catch (err) {
      console.error('Blog list error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  // Blog categories
  if (req.method === 'GET' && (url === '/blog/categories' || url === '/v1/blog/categories' || url === '/api/v1/blog/categories')) {
    try {
      const db = getPrisma();
      const cats = await db.blogCategory.findMany({
        include: { translations: true },
        orderBy: { sortOrder: 'asc' },
      });
      const data = cats.map((c) => {
        const trans = c.translations.find((t) => t.locale === 'en') || c.translations[0];
        return {
          id: c.id,
          slug: c.slug,
          name: trans?.name || c.slug,
          sortOrder: c.sortOrder,
        };
      });
      res.status(200).json({ success: true, data });
      return;
    } catch (err) {
      console.error('Blog cats error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  // Blog detail
  const blogMatch = url.match(/^(\/blog|\/v1\/blog|\/api\/v1\/blog)\/(.+)$/);
  if (req.method === 'GET' && blogMatch && !url.endsWith('/categories')) {
    const slug = blogMatch[2];
    try {
      const db = getPrisma();
      const post = await db.blogPost.findUnique({
        where: { slug },
        include: {
          translations: true,
          category: { include: { translations: true } },
        },
      });
      if (!post) {
        res.status(404).json({ success: false, message: 'Not found' });
        return;
      }
      const enTrans = post.translations.find((t) => t.locale === 'en') || post.translations[0];
      res.status(200).json({
        success: true,
        data: {
          id: post.id,
          slug: post.slug,
          title: enTrans?.title || post.slug,
          excerpt: enTrans?.excerpt || post.excerpt,
          content: enTrans?.content || post.content,
          coverImage: post.coverImage,
          authorName: post.authorName,
          category: post.category ? {
            id: post.category.id,
            slug: post.category.slug,
            name: post.category.translations?.find((t) => t.locale === 'en')?.name || post.category.slug,
          } : null,
          tags: post.tags || [],
          publishedAt: post.publishedAt,
          viewCount: post.viewCount || 0,
        },
      });
      return;
    } catch (err) {
      console.error('Blog detail error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  // Products list
  if (req.method === 'GET' && (url === '/products' || url === '/v1/products' || url === '/api/v1/products')) {
    try {
      const db = getPrisma();
      const products = await db.product.findMany({
        where: { published: true, deletedAt: null },
        include: { translations: true },
        orderBy: { sortOrder: 'asc' },
        take: 50,
      });
      const items = products.map((p) => {
        const en = p.translations.find((t) => t.locale === 'en') || p.translations[0];
        return {
          id: p.id,
          sku: p.sku,
          model: p.model,
          slug: p.slug,
          name: en?.name || p.model,
          shortDescription: en?.shortDescription || p.shortDescription,
          energyDensity: p.energyDensity,
          cycleLife: p.cycleLife,
          weight: p.weight,
          nominalVoltage: p.nominalVoltage,
          nominalCapacity: p.nominalCapacity,
          dischargeRate: p.dischargeRate,
          published: p.published,
          featured: p.featured,
        };
      });
      res.status(200).json({
        success: true,
        items,
        meta: { page: 1, pageSize: items.length, total: items.length, totalPages: 1 },
      });
      return;
    } catch (err) {
      console.error('Products error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  // Product detail
  const prodMatch = url.match(/^(\/products|\/v1\/products|\/api\/v1\/products)\/(.+)$/);
  if (req.method === 'GET' && prodMatch && !url.endsWith('/categories')) {
    const slug = prodMatch[2];
    try {
      const db = getPrisma();
      const p = await db.product.findUnique({
        where: { slug },
        include: { translations: true },
      });
      if (!p) {
        res.status(404).json({ success: false, message: 'Not found' });
        return;
      }
      const en = p.translations.find((t) => t.locale === 'en') || p.translations[0];
      res.status(200).json({
        success: true,
        data: {
          id: p.id,
          sku: p.sku,
          model: p.model,
          slug: p.slug,
          name: en?.name || p.model,
          shortDescription: en?.shortDescription || p.shortDescription,
          description: en?.description || p.description,
          energyDensity: p.energyDensity,
          cycleLife: p.cycleLife,
          weight: p.weight,
          nominalVoltage: p.nominalVoltage,
          nominalCapacity: p.nominalCapacity,
          dischargeRate: p.dischargeRate,
          published: p.published,
          featured: p.featured,
        },
      });
      return;
    } catch (err) {
      console.error('Product detail error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  // Banners
  if (req.method === 'GET' && (url === '/banners' || url === '/v1/banners' || url === '/api/v1/banners')) {
    try {
      const db = getPrisma();
      const banners = await db.banner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      res.status(200).json({
        success: true,
        data: banners,
      });
      return;
    } catch (err) {
      console.error('Banners error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  // Default 404
  res.status(404).json({ statusCode: 404, message: 'Not Found', path: url });
};