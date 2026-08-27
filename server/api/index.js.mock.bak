/**
 * Minimal Vercel Serverless Handler
 * - Locally: uses Prisma from node_modules
 * - On Vercel: bypasses @prisma/client stub, requires generated client directly
 */
const path = require('path');

function findGeneratedClientPath() {
  // Project-local deploy directory containing the pre-generated client.
  // Vercel's allow-scripts skips postinstall, so the npm-bundled @prisma/client
  // is just a stub. We ship the real generated client in .prisma-deploy/client/
  // so the runtime engine binary + generated index.js are bundled.
  const candidates = [
    path.join(__dirname, '.prisma-deploy', 'client'),
    path.resolve(__dirname, '..', '.prisma-deploy', 'client'),
    path.join(process.env.LAMBDA_TASK_ROOT || '/var/task', 'node_modules', '.prisma', 'client'),
    path.resolve(process.cwd(), 'node_modules', '.prisma', 'client'),
  ];
  for (const p of candidates) {
    try {
      require.resolve(p);
      return p;
    } catch (e) { /* next */ }
  }
  return null;
}

const generatedClientPath = findGeneratedClientPath();
let PrismaClient;

if (generatedClientPath) {
  const gen = require(path.join(generatedClientPath, 'index.js'));
  PrismaClient = gen.PrismaClient;
} else {
  PrismaClient = require('@prisma/client').PrismaClient;
}

let prisma = null;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({ log: ['error', 'warn'] });
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

  if (url === '/health' || url === '/v1/health' || url === '/api/v1/health') {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

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
          user: { id: '906f0e6e-0f4c-474d-96d2-e891c0445551', email: 'admin@ssebatt.com', name: 'Admin', role: 'ADMIN' },
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

  // Helper: pick a translation matching the requested locale
  function pickTranslation(translations, locale) {
    if (!translations || translations.length === 0) return null;
    if (locale) {
      const exact = translations.find((t) => t.locale === locale);
      if (exact) return exact;
      // zh-CN should also match locale=zh
      const shortLocale = locale.split('-')[0];
      if (shortLocale !== locale) {
        const partial = translations.find((t) => t.locale === shortLocale);
        if (partial) return partial;
      }
    }
    return translations.find((t) => t.locale === 'en') || translations[0];
  }

  // Helper: convert simple HTML content to plain text with paragraph breaks
  // so the frontend's markdown-like renderer can display it correctly
  function htmlToPlain(html) {
    if (!html) return '';
    return String(html)
      // Normalize line endings
      .replace(/\r\n?/g, '\n')
      // Convert <br> to newline
      .replace(/<br\s*\/?>/gi, '\n')
      // Convert </p><p> boundaries to double newlines (paragraph break)
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
      // Strip remaining <p> and </p> tags
      .replace(/<\/?p[^>]*>/gi, '\n\n')
      // Strip any other HTML tags
      .replace(/<[^>]+>/g, '')
      // Decode common HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      // Collapse runs of more than two newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  if (req.method === 'GET' && (url === '/blog' || url === '/v1/blog' || url === '/api/v1/blog')) {
    try {
      const locale = (req.query?.locale || (req.url && new URL(req.url, 'http://x').searchParams.get('locale')) || 'en').toString();
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
        const tr = pickTranslation(p.translations, locale);
        const catTr = pickTranslation(p.category?.translations, locale);
        return {
          id: p.id, slug: p.slug,
          title: tr?.title || p.slug,
          excerpt: htmlToPlain(tr?.excerpt || p.excerpt),
          coverImage: p.coverImage, authorName: p.authorName,
          category: p.category ? { id: p.category.id, slug: p.category.slug, name: catTr?.name || p.category.slug } : null,
          tags: p.tags || [], publishedAt: p.publishedAt, viewCount: p.viewCount || 0,
        };
      });
      res.status(200).json({ success: true, items, meta: { page: 1, pageSize: items.length, total: items.length, totalPages: 1 } });
      return;
    } catch (err) {
      console.error('Blog list error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  const blogMatch = url.match(/^(\/blog|\/v1\/blog|\/api\/v1\/blog)\/(.+)$/);
  if (req.method === 'GET' && blogMatch && !url.endsWith('/categories')) {
    const slug = blogMatch[2];
    try {
      const locale = (req.query?.locale || (req.url && new URL(req.url, 'http://x').searchParams.get('locale')) || 'en').toString();
      const db = getPrisma();
      const post = await db.blogPost.findUnique({
        where: { slug },
        include: { translations: { orderBy: { locale: 'asc' } }, category: { include: { translations: { orderBy: { locale: 'asc' } } } } },
      });
      if (!post) { res.status(404).json({ success: false, message: 'Not found' }); return; }
      const tr = pickTranslation(post.translations, locale);
      const catTr = pickTranslation(post.category?.translations, locale);
      res.status(200).json({
        success: true,
        data: {
          id: post.id, slug: post.slug,
          title: tr?.title || post.slug,
          excerpt: htmlToPlain(tr?.excerpt || post.excerpt),
          content: htmlToPlain(tr?.content || post.content),
          coverImage: post.coverImage, authorName: post.authorName,
          category: post.category ? { id: post.category.id, slug: post.category.slug, name: catTr?.name || post.category.slug } : null,
          tags: post.tags || [], publishedAt: post.publishedAt, viewCount: post.viewCount || 0,
          // Always include all translations so the detail page can switch languages client-side
          // Each translation's content is converted from HTML to plain text with paragraph breaks
          // so the frontend's renderer can display it correctly without parsing HTML
          translations: (post.translations || []).map((t) => ({
            locale: t.locale, title: t.title, excerpt: t.excerpt ? htmlToPlain(t.excerpt) : t.excerpt, content: htmlToPlain(t.content),
          })),
        },
      });
      return;
    } catch (err) {
      console.error('Blog detail error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  if (req.method === 'GET' && (url === '/products' || url === '/v1/products' || url === '/api/v1/products')) {
    try {
      const locale = (req.query?.locale || (req.url && new URL(req.url, 'http://x').searchParams.get('locale')) || 'en').toString();
      const db = getPrisma();
      const products = await db.product.findMany({
        where: { published: true, deletedAt: null },
        include: { translations: { orderBy: { locale: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
        take: 50,
      });
      const items = products.map((p) => {
        const tr = pickTranslation(p.translations, locale);
        return {
          id: p.id, sku: p.sku, model: p.model, slug: p.slug,
          name: tr?.name || p.model,
          shortDescription: tr?.shortDescription || p.shortDescription,
          energyDensity: p.energyDensity, cycleLife: p.cycleLife, weight: p.weight,
          nominalVoltage: p.nominalVoltage, nominalCapacity: p.nominalCapacity,
          dischargeRate: p.dischargeRate, published: p.published, featured: p.featured,
        };
      });
      res.status(200).json({ success: true, items, meta: { page: 1, pageSize: items.length, total: items.length, totalPages: 1 } });
      return;
    } catch (err) {
      console.error('Products error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  const prodMatch = url.match(/^(\/products|\/v1\/products|\/api\/v1\/products)\/(.+)$/);
  if (req.method === 'GET' && prodMatch && !url.endsWith('/categories')) {
    const slug = prodMatch[2];
    try {
      const locale = (req.query?.locale || (req.url && new URL(req.url, 'http://x').searchParams.get('locale')) || 'en').toString();
      const db = getPrisma();
      const p = await db.product.findUnique({ where: { slug }, include: { translations: { orderBy: { locale: 'asc' } } } });
      if (!p) { res.status(404).json({ success: false, message: 'Not found' }); return; }
      const tr = pickTranslation(p.translations, locale);
      res.status(200).json({
        success: true,
        data: {
          id: p.id, sku: p.sku, model: p.model, slug: p.slug,
          name: tr?.name || p.model,
          shortDescription: tr?.shortDescription || p.shortDescription,
          description: tr?.description || p.description,
          energyDensity: p.energyDensity, cycleLife: p.cycleLife, weight: p.weight,
          nominalVoltage: p.nominalVoltage, nominalCapacity: p.nominalCapacity,
          dischargeRate: p.dischargeRate, published: p.published, featured: p.featured,
        },
      });
      return;
    } catch (err) {
      console.error('Product detail error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  if (req.method === 'GET' && (url === '/banners' || url === '/v1/banners' || url === '/api/v1/banners')) {
    try {
      const db = getPrisma();
      const banners = await db.$queryRaw`
        SELECT id, title, subtitle, "ctaText", "titleZh", "subtitleZh", "ctaTextZh",
               image, "mobileImage", link, "isActive", "sortOrder",
               "seoTitle", "seoDescription", "createdAt", "updatedAt"
        FROM banners
        WHERE "isActive" = true
        ORDER BY "sortOrder" ASC
      `;
      res.status(200).json({ success: true, data: banners });
      return;
    } catch (err) {
      console.error('Banners error:', err.message);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
  }

  res.status(404).json({ statusCode: 404, message: 'Not Found', path: url });
};