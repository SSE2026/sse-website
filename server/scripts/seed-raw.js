require('dotenv').config({path: '.env.production.local'});
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  try {
    // Clean up partial data
    await p.$executeRaw`DELETE FROM blog_post_translations`;
    await p.$executeRaw`DELETE FROM blog_posts`;
    await p.$executeRaw`DELETE FROM blog_category_translations`;
    await p.$executeRaw`DELETE FROM blog_categories`;
    await p.$executeRaw`DELETE FROM product_translations`;
    await p.$executeRaw`DELETE FROM products`;
    await p.$executeRaw`DELETE FROM product_category_translations`;
    await p.$executeRaw`DELETE FROM product_categories`;
    await p.$executeRaw`DELETE FROM banners`;

    // Blog Categories
    await p.$executeRaw`INSERT INTO blog_categories (id, slug, "createdAt", "updatedAt") VALUES ('bc-1', 'company', NOW(), NOW()), ('bc-2', 'technology', NOW(), NOW()), ('bc-3', 'product', NOW(), NOW()), ('bc-4', 'industry', NOW(), NOW())`;

    await p.$executeRaw`INSERT INTO blog_category_translations (id, "categoryId", locale, name) VALUES ('bct-1', 'bc-1', 'en', 'Company News'), ('bct-2', 'bc-1', 'zh', '公司动态'), ('bct-3', 'bc-2', 'en', 'Technology'), ('bct-4', 'bc-2', 'zh', '技术前沿'), ('bct-5', 'bc-3', 'en', 'Product'), ('bct-6', 'bc-3', 'zh', '产品发布'), ('bct-7', 'bc-4', 'en', 'Industry'), ('bct-8', 'bc-4', 'zh', '行业观察')`;

    // Blog Posts
    await p.$executeRaw`INSERT INTO blog_posts (id, slug, "coverImage", "authorName", "categoryId", tags, excerpt, content, published, featured, "publishedAt", "createdAt", "updatedAt") VALUES
      ('bp-1', 'sse-2026-q1-strategy-summit', '/images/news/summit-2026.jpg', 'SSE Editorial Team', 'bc-1', ARRAY['strategy','global','2026'], 'Strategic roadmap for 2026.', '<p>EN content</p>', true, true, '2026-02-15', NOW(), NOW()),
      ('bp-2', '460-x-energy-density-breakthrough', '/images/news/460x-breakthrough.jpg', 'Dr. Wei Chen', 'bc-2', ARRAY['rd','tech'], 'Breakthrough achieved.', '<p>EN content</p>', true, true, '2026-02-08', NOW(), NOW()),
      ('bp-3', 'aeroride-400-e-launch', '/images/news/400e-launch.jpg', 'Product Team', 'bc-3', ARRAY['product'], '400-E series launches.', '<p>EN content</p>', true, true, '2026-01-28', NOW(), NOW()),
      ('bp-4', 'drone-battery-market-2026', '/images/news/drone-market.jpg', 'Market Research', 'bc-4', ARRAY['market'], 'Industry analysis.', '<p>EN content</p>', true, false, '2026-01-20', NOW(), NOW()),
      ('bp-5', 'sse-europe-expansion', '/images/news/berlin-office.jpg', 'SSE Editorial Team', 'bc-1', ARRAY['expansion'], 'Berlin office.', '<p>EN content</p>', true, false, '2026-01-15', NOW(), NOW()),
      ('bp-6', 'low-temperature-performance', '/images/news/cold-weather.jpg', 'Dr. Mei Lin', 'bc-2', ARRAY['rd'], 'Cold weather performance.', '<p>EN content</p>', true, false, '2026-01-10', NOW(), NOW())`;

    // Blog post translations
    await p.$executeRaw`INSERT INTO blog_post_translations (id, "blogPostId", locale, title, excerpt, content, "createdAt", "updatedAt") VALUES
      ('bpt-1-en', 'bp-1', 'en', 'SSE 2026 Q1 Strategy Summit Held in Shenzhen HQ', 'Strategic summit for 2026.', '<p>EN content</p>', NOW(), NOW()),
      ('bpt-1-zh', 'bp-1', 'zh', 'SSE 2026 Q1 战略峰会在深圳召开', '2026 战略峰会。', '<p>中文内容</p>', NOW(), NOW()),
      ('bpt-2-en', 'bp-2', 'en', '460 Wh/kg Energy Density: New Benchmark', 'Breakthrough achieved.', '<p>EN content</p>', NOW(), NOW()),
      ('bpt-2-zh', 'bp-2', 'zh', '460 Wh/kg 能量密度：新标杆', '技术突破。', '<p>中文内容</p>', NOW(), NOW()),
      ('bpt-3-en', 'bp-3', 'en', 'Aeroride 400-E Officially Launches', 'New 400-E series.', '<p>EN content</p>', NOW(), NOW()),
      ('bpt-3-zh', 'bp-3', 'zh', 'Aeroride 400-E 正式发布', '400-E 系列发布。', '<p>中文内容</p>', NOW(), NOW()),
      ('bpt-4-en', 'bp-4', 'en', 'Global Drone Battery Market: 2026 Trends', 'Industry analysis.', '<p>EN content</p>', NOW(), NOW()),
      ('bpt-4-zh', 'bp-4', 'zh', '全球无人机电池市场：2026 趋势', '行业分析。', '<p>中文内容</p>', NOW(), NOW()),
      ('bpt-5-en', 'bp-5', 'en', 'SSE Expands European Distribution Network', 'Berlin office.', '<p>EN content</p>', NOW(), NOW()),
      ('bpt-5-zh', 'bp-5', 'zh', 'SSE 扩大欧洲分销网络', '柏林办公室。', '<p>中文内容</p>', NOW(), NOW()),
      ('bpt-6-en', 'bp-6', 'en', 'How SSE Batteries Deliver at -40°C', 'Cold weather performance.', '<p>EN content</p>', NOW(), NOW()),
      ('bpt-6-zh', 'bp-6', 'zh', 'SSE 电池如何在 -40°C 工作', '低温性能。', '<p>中文内容</p>', NOW(), NOW())`;

    // Product categories
    await p.$executeRaw`INSERT INTO product_categories (id, slug, "createdAt", "updatedAt") VALUES ('pc-1', 'high-energy-battery', NOW(), NOW())`;
    await p.$executeRaw`INSERT INTO product_category_translations (id, "categoryId", locale, name) VALUES ('pct-1', 'pc-1', 'en', 'High Energy Battery'), ('pct-2', 'pc-1', 'zh', '高能量电池')`;

    // Products
    await p.$executeRaw`INSERT INTO products (id, sku, model, slug, "categoryId", brand, chemistry, "shortDescription", "nominalVoltage", "nominalCapacity", "energyDensity", "dischargeRate", length, width, height, weight, "cycleLife", published, featured, "createdAt", "updatedAt") VALUES
      ('pr-1', 'SSE-360P-001', 'Aeroride 360-P', 'cloudchi-360-p', 'pc-1', 'Swift Safe Energy', 'NMC', 'Urban e-mobility battery.', 48, 100, 360, 5, 400, 200, 80, 3.5, 2000, true, true, NOW(), NOW()),
      ('pr-2', 'SSE-400E-001', 'Aeroride 400-E', 'cloudchi-400-e', 'pc-1', 'Swift Safe Energy', 'NMC', 'High-performance battery.', 72, 80, 400, 10, 350, 180, 75, 2.8, 1500, true, true, NOW(), NOW()),
      ('pr-3', 'SSE-460X-001', 'Aeroride 460-X', 'cloudchi-460-x', 'pc-1', 'Swift Safe Energy', 'NMC', 'Industry-leading 460 Wh/kg.', 96, 60, 460, 8, 300, 150, 70, 2.2, 1000, true, true, NOW(), NOW())`;

    // Product translations
    await p.$executeRaw`INSERT INTO product_translations (id, "productId", locale, name, "shortDescription", "createdAt", "updatedAt") VALUES
      ('pt-1', 'pr-1', 'en', 'Aeroride 360-P Urban Series', 'Urban e-mobility.', NOW(), NOW()),
      ('pt-2', 'pr-1', 'zh', 'Aeroride 360-P 城市系列', '城市电动出行。', NOW(), NOW()),
      ('pt-3', 'pr-2', 'en', 'Aeroride 400-E Performance Series', 'High performance.', NOW(), NOW()),
      ('pt-4', 'pr-2', 'zh', 'Aeroride 400-E 高性能系列', '高性能。', NOW(), NOW()),
      ('pt-5', 'pr-3', 'en', 'Aeroride 460-X eVTOL Series', 'eVTOL battery.', NOW(), NOW()),
      ('pt-6', 'pr-3', 'zh', 'Aeroride 460-X eVTOL 系列', 'eVTOL 电池。', NOW(), NOW())`;

    // Banners
    await p.$executeRaw`INSERT INTO banners (id, title, subtitle, "ctaText", "titleZh", "subtitleZh", "ctaTextZh", image, link, "isActive", "sortOrder", "createdAt", "updatedAt") VALUES
      ('bn-1', 'Aeroride 460-X Series', '460 Wh/kg Energy Density', 'Learn More', 'Aeroride 460-X 系列', '460 Wh/kg 能量密度', '了解更多', '/images/banner/460x-banner.jpg', '/products/cloudchi-460-x', true, 1, NOW(), NOW()),
      ('bn-2', 'Swift Safe Energy', 'Powering Tomorrow Mobility', 'About Us', '深安锂能', '驱动未来出行', '关于我们', '/images/banner/sse-banner.jpg', '/about', true, 2, NOW(), NOW())`;

    const counts = {
      blogCategories: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM blog_categories`)[0].c,
      blogPosts: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM blog_posts`)[0].c,
      blogTranslations: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM blog_post_translations`)[0].c,
      productCategories: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM product_categories`)[0].c,
      products: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM products`)[0].c,
      productTranslations: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM product_translations`)[0].c,
      banners: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM banners`)[0].c,
    };
    console.log('Final counts:', JSON.stringify(counts, null, 2));
  } catch(e) {
    console.log('ERROR:', e.message);
    console.log(e.stack);
  } finally {
    await p.$disconnect();
  }
})();