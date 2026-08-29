/**
 * Swift Safe Energy — Vercel Serverless Handler (slim, Prisma-direct)
 *
 * Zero-config Vercel function. Serves the same /v1 API surface the frontend
 * expects, using Prisma directly (no NestJS, no webpack bundle). This is the
 * architecture that previously deployed and ran successfully on Vercel.
 *
 * Env (set on the sse-api Vercel project):
 *   DATABASE_URL, JWT_SECRET, CORS_ORIGIN / FRONTEND_URL,
 *   CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Prisma client: on Linux (Vercel) use the committed generated client in
// .prisma-deploy (shipped with its matching RHEL query engine); locally use
// node_modules @prisma/client so the platform-matched engine is used.
let PrismaClient;
if (process.platform === 'linux') {
  const DEPLOY_CLIENT = path.join(__dirname, '..', '.prisma-deploy', 'client', 'index.js');
  if (fs.existsSync(DEPLOY_CLIENT)) {
    const ENGINE = path.join(
      __dirname,
      '..',
      '.prisma-deploy',
      'client',
      'libquery_engine-rhel-openssl-3.0.x.so.node',
    );
    if (fs.existsSync(ENGINE)) {
      process.env.PRISMA_QUERY_ENGINE_BINARY = ENGINE;
    }
    ({ PrismaClient } = require(DEPLOY_CLIENT));
  }
}
if (!PrismaClient) {
  ({ PrismaClient } = require('@prisma/client'));
}

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

let prisma = null;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({ log: ['error', 'warn'] });
  }
  return prisma;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      resolve(req.body);
      return;
    }
    let data = '';
    req.on('data', (c) => {
      data += c;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function send(res, status, payload) {
  res.status(status).json(payload);
}

function ok(res, data) {
  send(res, 200, { success: true, data });
}

// Admin list responses: pages expect `{ success, items, meta }` at the top
// level (some read `json?.data ?? json` then `.items`; returning top-level
// `items` satisfies both).
function sendList(res, items, page = 1, pageSize = items.length) {
  send(res, 200, {
    success: true,
    items,
    meta: { page, pageSize, total: items.length, totalPages: Math.max(1, Math.ceil(items.length / Math.max(1, pageSize))) },
  });
}

function fail(res, status, message) {
  send(res, status, { success: false, message });
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

function verifyToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function requireAdmin(req, res) {
  const payload = verifyToken(req);
  if (!payload || payload.role !== 'ADMIN') {
    fail(res, 401, 'Unauthorized');
    return null;
  }
  return payload;
}

function queryParams(req) {
  const q = new URL(req.url, 'http://x').searchParams;
  return q;
}

function productShape(p) {
  const en = (p.translations || []).find((t) => t.locale === 'en') || (p.translations || [])[0];
  const variants = (p.variants || [])
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      nameEn: v.nameEn,
      image: v.image,
      nominalVoltage: v.nominalVoltage,
      nominalCapacity: v.nominalCapacity,
      energy: v.energy,
      energyDensity: v.energyDensity,
      length: v.length,
      width: v.width,
      height: v.height,
      weight: v.weight,
      priceUsd: v.priceUsd,
      priceUsdMin: v.priceUsdMin,
      priceUsdMax: v.priceUsdMax,
      specifications: v.specifications,
      published: v.published,
      sortOrder: v.sortOrder,
    }));
  return {
    id: p.id,
    sku: p.sku,
    model: p.model,
    slug: p.slug,
    name: en?.name || p.model,
    shortDescription: en?.shortDescription || p.shortDescription,
    description: en?.description || p.description,
    brand: p.brand,
    chemistry: p.chemistry,
    energyDensity: p.energyDensity,
    nominalVoltage: p.nominalVoltage,
    nominalCapacity: p.nominalCapacity,
    energy: p.energy,
    weight: p.weight,
    length: p.length,
    width: p.width,
    height: p.height,
    cycleLife: p.cycleLife,
    dischargeRate: p.dischargeRate,
    peakDischargeRate: p.peakDischargeRate,
    specifications: p.specifications,
    features: p.features,
    applications: p.applications,
    published: p.published,
    featured: p.featured,
    sortOrder: p.sortOrder,
    variants,
  };
}

function uploadToCloudinary(buffer, folder, mimeType) {
  return new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const resourceType = String(mimeType || '').startsWith('video') ? 'video' : 'image';
    const publicId = `${folder}/${Date.now().toString(36)}_${crypto.randomBytes(6).toString('hex')}`;
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, folder, resource_type: resourceType, overwrite: true, invalidate: true },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

module.exports = async function handler(req, res) {
  const url = (req.url || '').split('?')[0];

  // CORS
  const origin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const db = getPrisma();

  // Health
  if (url === '/health' || url === '/v1/health') {
    send(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  try {
    // ---------------- AUTH ----------------
    if (url === '/v1/auth/login' && req.method === 'POST') {
      const body = await readBody(req);
      const user = await db.user.findUnique({ where: { email: body.email } });
      if (!user || !user.isActive) {
        fail(res, 401, 'Invalid credentials');
        return;
      }
      const valid = await bcrypt.compare(body.password, user.password);
      if (!valid) {
        fail(res, 401, 'Invalid credentials');
        return;
      }
      ok(res, {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken: signToken(user),
        tokenType: 'Bearer',
        expiresIn: 604800,
      });
      return;
    }

    if (url === '/v1/auth/register' && req.method === 'POST') {
      const body = await readBody(req);
      const hashed = await bcrypt.hash(body.password || '', 10);
      const user = await db.user.create({
        data: { email: body.email, password: hashed, name: body.name || body.email, role: 'USER' },
      });
      ok(res, { user: { id: user.id, email: user.email, name: user.name, role: user.role } });
      return;
    }

    if (url === '/v1/auth/bootstrap' && req.method === 'POST') {
      const body = await readBody(req);
      const existing = await db.user.findFirst({ where: { role: 'ADMIN' } });
      if (existing) {
        fail(res, 409, 'Admin already exists');
        return;
      }
      const hashed = await bcrypt.hash(body.password || 'Admin123!', 10);
      const admin = await db.user.create({
        data: {
          email: body.email || 'admin@example.com',
          password: hashed,
          name: 'Admin',
          role: 'ADMIN',
          isActive: true,
        },
      });
      ok(res, { user: { id: admin.id, email: admin.email, role: 'ADMIN' } });
      return;
    }

    // ---------------- PUBLIC PRODUCTS ----------------
    const prodList = /^\/v1\/products\/?$/.test(url);
    const prodMatch = url.match(/^\/v1\/products\/([^/]+)\/?$/);
    if (req.method === 'GET' && (prodList || prodMatch)) {
      if (prodList) {
        const products = await db.product.findMany({
          where: { published: true, deletedAt: null },
          include: { variants: true, translations: true },
          orderBy: { sortOrder: 'asc' },
          take: 100,
        });
        ok(res, products.map(productShape));
        return;
      }
      const slug = prodMatch[1];
      const p = await db.product.findUnique({
        where: { slug },
        include: { variants: true, translations: true },
      });
      if (!p || p.deletedAt) {
        fail(res, 404, 'Product not found');
        return;
      }
      ok(res, productShape(p));
      return;
    }

    // ---------------- PUBLIC CONTENT ----------------
    const contentMatch = url.match(/^\/v1\/content\/([^/]+)\/?$/);
    if (req.method === 'GET' && contentMatch) {
      const page = contentMatch[1];
      const locale = queryParams(req).get('locale') || 'en';
      const pc = await db.pageContent.findUnique({
        where: { page_locale: { page, locale } },
      });
      if (!pc) {
        fail(res, 404, 'Content not found');
        return;
      }
      ok(res, { page, locale, content: pc.content });
      return;
    }

    // ---------------- PUBLIC INQUIRIES ----------------
    if (url === '/v1/inquiries' && req.method === 'POST') {
      const body = await readBody(req);
      const inquiry = await db.inquiry.create({
        data: {
          inquiryNumber: 'INQ-' + Date.now().toString(36).toUpperCase(),
          inquiryType: body.inquiryType || 'PRODUCT',
          customerName: body.customerName,
          companyName: body.companyName,
          email: body.email,
          phone: body.phone,
          message: body.message,
          status: 'NEW',
        },
      });
      ok(res, { id: inquiry.id, inquiryNumber: inquiry.inquiryNumber });
      return;
    }

    // ---------------- ADMIN: AUTH ----------------
    const adminPayload = await requireAdmin(req, res);
    if (!adminPayload) return;

    // ---- Admin products ----
    const adminProducts = /^\/v1\/admin\/products\/?$/.test(url);
    const adminProductMatch = url.match(/^\/v1\/admin\/products\/([^/]+)\/?$/);
    const adminVariantsMatch = url.match(/^\/v1\/admin\/products\/([^/]+)\/variants(?:\/([^/]+))?\/?$/);

    if (adminProducts && req.method === 'GET') {
      const products = await db.product.findMany({
        where: { deletedAt: null },
        include: { variants: true, translations: true, category: true },
        orderBy: { updatedAt: 'desc' },
        take: 200,
      });
      sendList(res, products.map(productShape));
      return;
    }
    if (adminProducts && req.method === 'POST') {
      const body = await readBody(req);
      const slug = body.slug || String(body.model || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const product = await db.product.create({
        data: {
          sku: body.sku,
          model: body.model,
          slug,
          categoryId: body.categoryId,
          brand: body.brand,
          chemistry: body.chemistry,
          shortDescription: body.shortDescription,
          description: body.description,
          nominalVoltage: body.nominalVoltage,
          nominalCapacity: body.nominalCapacity,
          energy: body.energy,
          energyDensity: body.energyDensity,
          weight: body.weight,
          published: body.published ?? false,
          featured: body.featured ?? false,
          sortOrder: body.sortOrder ?? 0,
          specifications: body.specifications,
        },
      });
      ok(res, { id: product.id });
      return;
    }
    if (adminProductMatch) {
      const id = adminProductMatch[1];
      if (req.method === 'GET') {
        const p = await db.product.findUnique({
          where: { id },
          include: { variants: true, translations: true },
        });
        if (!p) {
          fail(res, 404, 'Product not found');
          return;
        }
        ok(res, productShape(p));
        return;
      }
      if (req.method === 'PATCH') {
        const body = await readBody(req);
        const data = { ...body };
        delete data.id;
        delete data.variants;
        const product = await db.product.update({ where: { id }, data });
        ok(res, { id: product.id });
        return;
      }
      if (req.method === 'DELETE') {
        await db.product.update({ where: { id }, data: { deletedAt: new Date() } });
        ok(res, { id });
        return;
      }
    }
    // Product variants
    if (adminVariantsMatch) {
      const productId = adminVariantsMatch[1];
      const variantId = adminVariantsMatch[2];
      if (req.method === 'GET') {
        const variants = await db.productVariant.findMany({ where: { productId }, orderBy: { sortOrder: 'asc' } });
        ok(res, variants);
        return;
      }
      if (req.method === 'POST' && !variantId) {
        const body = await readBody(req);
        const variant = await db.productVariant.create({
          data: {
            productId,
            sku: body.sku,
            name: body.name,
            nameEn: body.nameEn,
            image: body.image,
            nominalVoltage: body.nominalVoltage,
            nominalCapacity: body.nominalCapacity,
            energy: body.energy,
            energyDensity: body.energyDensity,
            weight: body.weight,
            specifications: body.specifications,
            priceUsd: body.priceUsd,
            priceUsdMin: body.priceUsdMin,
            priceUsdMax: body.priceUsdMax,
            published: body.published ?? true,
            sortOrder: body.sortOrder ?? 0,
          },
        });
        ok(res, { id: variant.id });
        return;
      }
      if (variantId && req.method === 'PATCH') {
        const body = await readBody(req);
        const data = { ...body };
        delete data.id;
        delete data.productId;
        const variant = await db.productVariant.update({ where: { id: variantId }, data });
        ok(res, { id: variant.id });
        return;
      }
      if (variantId && req.method === 'DELETE') {
        await db.productVariant.delete({ where: { id: variantId } });
        ok(res, { id: variantId });
        return;
      }
    }

    // ---- Admin categories ----
    const adminCats = /^\/v1\/admin\/categories\/?$/.test(url);
    const adminCatMatch = url.match(/^\/v1\/admin\/categories\/([^/]+)\/?$/);
    if (adminCats && req.method === 'GET') {
      const cats = await db.productCategory.findMany({ orderBy: { sortOrder: 'asc' } });
      ok(res, cats);
      return;
    }
    if (adminCats && req.method === 'POST') {
      const body = await readBody(req);
      const cat = await db.productCategory.create({
        data: { name: body.name, slug: body.slug, sortOrder: body.sortOrder ?? 0, description: body.description },
      });
      ok(res, { id: cat.id });
      return;
    }
    if (adminCatMatch && (req.method === 'PATCH' || req.method === 'DELETE')) {
      const id = adminCatMatch[1];
      if (req.method === 'PATCH') {
        const body = await readBody(req);
        const data = { ...body };
        delete data.id;
        const cat = await db.productCategory.update({ where: { id }, data });
        ok(res, { id: cat.id });
        return;
      }
      await db.productCategory.delete({ where: { id } });
      ok(res, { id });
      return;
    }

    // ---- Admin content ----
    const adminContentList = /^\/v1\/admin\/content\/?$/.test(url);
    const adminContentMatch = url.match(/^\/v1\/admin\/content\/([^/]+)\/?$/);
    if (adminContentList && req.method === 'GET') {
      const locale = queryParams(req).get('locale') || 'en';
      const rows = await db.pageContent.findMany({ where: { locale } });
      sendList(res, rows);
      return;
    }
    if (adminContentMatch) {
      const page = adminContentMatch[1];
      const locale = queryParams(req).get('locale') || 'en';
      if (req.method === 'GET') {
        const pc = await db.pageContent.findUnique({ where: { page_locale: { page, locale } } });
        ok(res, pc ? { page, locale, content: pc.content, published: pc.published } : { page, locale, content: {} });
        return;
      }
      if (req.method === 'PATCH') {
        const body = await readBody(req);
        const pc = await db.pageContent.upsert({
          where: { page_locale: { page, locale } },
          create: { page, locale, content: body.content ?? {}, published: body.published ?? true },
          update: { content: body.content ?? {}, published: body.published ?? true },
        });
        ok(res, { id: pc.id, page, locale });
        return;
      }
    }

    // ---- Admin inquiries ----
    const adminInqList = /^\/v1\/admin\/inquiries\/?$/.test(url);
    const adminInqMatch = url.match(/^\/v1\/admin\/inquiries\/([^/]+)\/?$/);
    const adminInqStatus = url.match(/^\/v1\/admin\/inquiries\/([^/]+)\/status\/?$/);
    const adminInqActivities = url.match(/^\/v1\/admin\/inquiries\/([^/]+)\/activities(?:\/([^/]+))?\/?$/);

    if (adminInqList && req.method === 'GET') {
      const inquiries = await db.inquiry.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 200 });
      sendList(res, inquiries);
      return;
    }
    if (adminInqMatch && req.method === 'GET') {
      const inquiry = await db.inquiry.findUnique({
        where: { id: adminInqMatch[1] },
        include: { activities: { orderBy: { createdAt: 'desc' } } },
      });
      if (!inquiry) {
        fail(res, 404, 'Inquiry not found');
        return;
      }
      ok(res, inquiry);
      return;
    }
    if (adminInqStatus && req.method === 'PATCH') {
      const body = await readBody(req);
      const inquiry = await db.inquiry.update({
        where: { id: adminInqStatus[1] },
        data: { status: body.status, priority: body.priority, assignedTo: body.assignedTo },
      });
      ok(res, { id: inquiry.id });
      return;
    }
    if (adminInqActivities && req.method === 'GET') {
      const activities = await db.leadActivity.findMany({
        where: { inquiryId: adminInqActivities[1] },
        orderBy: { createdAt: 'desc' },
      });
      ok(res, activities);
      return;
    }
    if (adminInqActivities && req.method === 'POST' && !adminInqActivities[2]) {
      const body = await readBody(req);
      const activity = await db.leadActivity.create({
        data: { inquiryId: adminInqActivities[1], type: body.type, note: body.note, performedBy: adminPayload.email },
      });
      ok(res, { id: activity.id });
      return;
    }

    // ---- Admin blog ----
    const adminBlogList = /^\/v1\/admin\/blog\/?$/.test(url);
    const adminBlogMatch = url.match(/^\/v1\/admin\/blog\/([^/]+)\/?$/);
    const adminBlogCats = /^\/v1\/admin\/blog\/categories\/?$/.test(url);
    if (adminBlogCats && req.method === 'GET') {
      const cats = await db.blogCategory.findMany({ orderBy: { sortOrder: 'asc' } });
      ok(res, cats);
      return;
    }
    if (adminBlogList && req.method === 'GET') {
      const posts = await db.blogPost.findMany({ where: { deletedAt: null }, orderBy: { publishedAt: 'desc' }, take: 100 });
      sendList(res, posts);
      return;
    }
    if (adminBlogList && req.method === 'POST') {
      const body = await readBody(req);
      const post = await db.blogPost.create({
        data: {
          slug: body.slug,
          title: body.title,
          excerpt: body.excerpt,
          content: body.content,
          coverImage: body.coverImage,
          categoryId: body.categoryId,
          published: body.published ?? false,
        },
      });
      ok(res, { id: post.id });
      return;
    }
    if (adminBlogMatch && req.method === 'PATCH') {
      const body = await readBody(req);
      const data = { ...body };
      delete data.id;
      const post = await db.blogPost.update({ where: { id: adminBlogMatch[1] }, data });
      ok(res, { id: post.id });
      return;
    }
    if (adminBlogMatch && req.method === 'DELETE') {
      await db.blogPost.update({ where: { id: adminBlogMatch[1] }, data: { deletedAt: new Date() } });
      ok(res, { id: adminBlogMatch[1] });
      return;
    }

    // ---- Admin media upload (Cloudinary) ----
    if (url === '/v1/admin/media/upload' && req.method === 'POST') {
      const folder = queryParams(req).get('folder') || 'products';
      const buffer = req.body && req.body instanceof Buffer ? req.body : null;
      if (!buffer) {
        fail(res, 400, 'No file provided');
        return;
      }
      const contentType = req.headers['content-type'] || '';
      const mimeType = contentType.split(';')[0].trim();
      if (!/^image\/(jpeg|png|webp)|^video\/(mp4|webm)/.test(mimeType)) {
        fail(res, 400, 'Invalid file type');
        return;
      }
      const result = await uploadToCloudinary(buffer, folder, mimeType);
      ok(res, { url: result.secure_url, publicId: result.public_id, mimeType, size: buffer.length });
      return;
    }

    // Default 404
    fail(res, 404, 'Not Found');
  } catch (err) {
    console.error('[slim-api] error:', err);
    fail(res, 500, (err && err.message) || 'Internal error');
  }
};
