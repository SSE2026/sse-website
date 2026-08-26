import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ===== Admin User =====
  const adminEmail = 'admin@ssebatt.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('SSEadmin2026!', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('✓ Admin user already exists');
  }

  // ===== Blog Categories =====
  const companyCat = await prisma.blogCategory.upsert({
    where: { slug: 'company' },
    update: {},
    create: {
      slug: 'company',
      translations: {
        create: [
          { locale: 'en', name: 'Company News' },
          { locale: 'zh', name: '公司动态' },
        ],
      },
    },
  });

  const techCat = await prisma.blogCategory.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      slug: 'technology',
      translations: {
        create: [
          { locale: 'en', name: 'Technology' },
          { locale: 'zh', name: '技术前沿' },
        ],
      },
    },
  });

  const productCat = await prisma.blogCategory.upsert({
    where: { slug: 'product' },
    update: {},
    create: {
      slug: 'product',
      translations: {
        create: [
          { locale: 'en', name: 'Product' },
          { locale: 'zh', name: '产品发布' },
        ],
      },
    },
  });

  const industryCat = await prisma.blogCategory.upsert({
    where: { slug: 'industry' },
    update: {},
    create: {
      slug: 'industry',
      translations: {
        create: [
          { locale: 'en', name: 'Industry' },
          { locale: 'zh', name: '行业观察' },
        ],
      },
    },
  });
  console.log('✅ Blog categories created');

  // ===== Blog Posts =====
  const blogPosts = [
    {
      slug: 'sse-2026-q1-strategy-summit',
      categoryId: companyCat.id,
      authorName: 'SSE Editorial Team',
      coverImage: '/images/news/summit-2026.jpg',
      tags: ['strategy', 'global', '2026'],
      excerpt: 'Swift Safe Energy convened its global leadership team to outline the strategic roadmap for 2026.',
      published: true,
      featured: true,
      publishedAt: new Date('2026-02-15T10:00:00Z'),
      translations: {
        create: [
          { locale: 'en', title: 'SSE 2026 Q1 Strategy Summit Held in Shenzhen HQ', content: '<p>Swift Safe Energy (SSE) successfully held its 2026 Q1 Strategy Summit at the Shenzhen headquarters, bringing together leaders from R&D, manufacturing, and business development to chart the path forward for next-generation battery technologies and global market expansion.</p>' },
          { locale: 'zh', title: 'SSE 2026 Q1 战略峰会在深圳总部召开', content: '<p>深安锂能（SSE）2026年第一季度战略峰会在深圳总部成功召开，汇聚了来自研发、制造和业务发展部门的领导，共同规划下一代电池技术和全球市场扩张的路径。</p>' },
        ],
      },
    },
    {
      slug: '460-x-energy-density-breakthrough',
      categoryId: techCat.id,
      authorName: 'Dr. Wei Chen',
      coverImage: '/images/news/460x-breakthrough.jpg',
      tags: ['rd', 'battery-tech', 'breakthrough'],
      excerpt: 'Our R&D team achieved a breakthrough in cell chemistry that pushes the Aeroride 460-X series to industry-leading energy density.',
      published: true,
      featured: true,
      publishedAt: new Date('2026-02-08T09:30:00Z'),
      translations: {
        create: [
          { locale: 'en', title: '460 Wh/kg Energy Density: The New Benchmark for eVTOL Batteries', content: '<p>The Aeroride 460-X series represents a leap forward in lithium battery technology, achieving 460 Wh/kg energy density while maintaining safety and cycle life characteristics required for commercial eVTOL operations.</p>' },
          { locale: 'zh', title: '460 Wh/kg 能量密度：eVTOL 电池的新标杆', content: '<p>Aeroride 460-X 系列代表了锂电池技术的飞跃，在保持商业 eVTOL 运行所需的安全性和循环寿命的同时，实现了 460 Wh/kg 的能量密度。</p>' },
        ],
      },
    },
    {
      slug: 'aeroride-400-e-launch',
      categoryId: productCat.id,
      authorName: 'Product Team',
      coverImage: '/images/news/400e-launch.jpg',
      tags: ['product-launch', 'urban-mobility', '400e'],
      excerpt: 'The new 400-E series combines high discharge rate with extended cycle life.',
      published: true,
      featured: true,
      publishedAt: new Date('2026-01-28T14:00:00Z'),
      translations: {
        create: [
          { locale: 'en', title: 'Aeroride 400-E Officially Launches: Powering Tomorrow\'s Urban Mobility', content: '<p>After 18 months of intensive development, SSE proudly introduces the Aeroride 400-E series — engineered for high-performance urban e-mobility with industry-leading discharge rates and cycle life.</p>' },
          { locale: 'zh', title: 'Aeroride 400-E 正式发布：为未来城市出行提供动力', content: '<p>经过 18 个月的密集研发，SSE 骄傲地推出 Aeroride 400-E 系列——专为高性能城市电动出行设计，具有行业领先的放电倍率和循环寿命。</p>' },
        ],
      },
    },
    {
      slug: 'drone-battery-market-2026',
      categoryId: industryCat.id,
      authorName: 'Market Research Team',
      coverImage: '/images/news/drone-market.jpg',
      tags: ['market', 'drones', 'analysis'],
      excerpt: 'An industry analysis of the commercial drone battery market.',
      published: true,
      featured: false,
      publishedAt: new Date('2026-01-20T11:30:00Z'),
      translations: {
        create: [
          { locale: 'en', title: 'Global Drone Battery Market: Trends and Forecasts for 2026', content: '<p>The commercial drone industry continues its rapid expansion, with battery technology as a critical enabler. This report analyzes key trends in technology adoption, regulatory landscape, and regional growth patterns.</p>' },
          { locale: 'zh', title: '全球无人机电池市场：2026 年趋势与预测', content: '<p>商业无人机行业持续快速扩张，电池技术是关键推动力。本报告分析了技术应用、法规环境和区域增长模式的主要趋势。</p>' },
        ],
      },
    },
    {
      slug: 'sse-europe-expansion',
      categoryId: companyCat.id,
      authorName: 'SSE Editorial Team',
      coverImage: '/images/news/berlin-office.jpg',
      tags: ['expansion', 'europe', 'sales'],
      excerpt: 'Opening of the Berlin sales office marks another milestone in SSE\'s commitment.',
      published: true,
      featured: false,
      publishedAt: new Date('2026-01-15T08:00:00Z'),
      translations: {
        create: [
          { locale: 'en', title: 'SSE Expands European Distribution Network with New Berlin Office', content: '<p>Swift Safe Energy is pleased to announce the opening of its European sales office in Berlin, Germany, strengthening our ability to serve customers across the region with localized support and faster delivery.</p>' },
          { locale: 'zh', title: 'SSE 在柏林设立新办公室，扩大欧洲分销网络', content: '<p>深安锂能欣然宣布在德国柏林设立欧洲销售办公室，加强我们为该地区客户提供本地化支持和更快交付的能力。</p>' },
        ],
      },
    },
    {
      slug: 'low-temperature-performance',
      categoryId: techCat.id,
      authorName: 'Dr. Mei Lin',
      coverImage: '/images/news/cold-weather.jpg',
      tags: ['rd', 'low-temp', 'extreme-conditions'],
      excerpt: 'A deep dive into our proprietary low-temperature electrolyte formulation.',
      published: true,
      featured: false,
      publishedAt: new Date('2026-01-10T13:00:00Z'),
      translations: {
        create: [
          { locale: 'en', title: 'How SSE Batteries Deliver Reliable Performance at -40°C', content: '<p>Operating batteries in extreme cold environments has long challenged the industry. Our proprietary low-temperature electrolyte and thermal management system enables reliable operation down to -40°C.</p>' },
          { locale: 'zh', title: 'SSE 电池如何在 -40°C 下提供可靠性能', content: '<p>在极冷环境下运行电池一直是行业的挑战。我们专有的低温电解液和热管理系统可在低至 -40°C 的环境下实现可靠运行。</p>' },
        ],
      },
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`✅ ${blogPosts.length} blog posts created`);

  // ===== Product Categories =====
  const batteryCat = await prisma.productCategory.upsert({
    where: { slug: 'high-energy-battery' },
    update: {},
    create: {
      slug: 'high-energy-battery',
      translations: {
        create: [
          { locale: 'en', name: 'High Energy Battery' },
          { locale: 'zh', name: '高能量电池' },
        ],
      },
    },
  });
  console.log('✅ Product categories created');

  // ===== Products =====
  const products = [
    {
      sku: 'SSE-360P-001',
      model: 'Aeroride 360-P',
      slug: 'cloudchi-360-p',
      categoryId: batteryCat.id,
      brand: 'Swift Safe Energy',
      chemistry: 'NMC',
      shortDescription: 'High energy density battery designed for urban e-mobility applications.',
      description: '<p>The Aeroride 360-P series delivers reliable performance for urban e-mobility with optimized energy density and cycle life.</p>',
      nominalVoltage: 48,
      nominalCapacity: 100,
      energyDensity: 360,
      dischargeRate: 5,
      length: 400,
      width: 200,
      height: 80,
      weight: 3.5,
      cycleLife: 2000,
      published: true,
      featured: true,
      translations: {
        create: [
          { locale: 'en', name: 'Aeroride 360-P Urban Series' },
          { locale: 'zh', name: 'Aeroride 360-P 城市系列' },
        ],
      },
    },
    {
      sku: 'SSE-400E-001',
      model: 'Aeroride 400-E',
      slug: 'cloudchi-400-e',
      categoryId: batteryCat.id,
      brand: 'Swift Safe Energy',
      chemistry: 'NMC',
      shortDescription: 'High discharge rate battery optimized for high-performance applications.',
      description: '<p>The Aeroride 400-E series combines high discharge rate with extended cycle life for high-performance e-mobility applications.</p>',
      nominalVoltage: 72,
      nominalCapacity: 80,
      energyDensity: 400,
      dischargeRate: 10,
      length: 350,
      width: 180,
      height: 75,
      weight: 2.8,
      cycleLife: 1500,
      published: true,
      featured: true,
      translations: {
        create: [
          { locale: 'en', name: 'Aeroride 400-E Performance Series' },
          { locale: 'zh', name: 'Aeroride 400-E 高性能系列' },
        ],
      },
    },
    {
      sku: 'SSE-460X-001',
      model: 'Aeroride 460-X',
      slug: 'cloudchi-460-x',
      categoryId: batteryCat.id,
      brand: 'Swift Safe Energy',
      chemistry: 'NMC',
      shortDescription: 'Industry-leading energy density for eVTOL and aerospace applications.',
      description: '<p>The Aeroride 460-X series achieves industry-leading 460 Wh/kg energy density for eVTOL and aerospace applications.</p>',
      nominalVoltage: 96,
      nominalCapacity: 60,
      energyDensity: 460,
      dischargeRate: 8,
      length: 300,
      width: 150,
      height: 70,
      weight: 2.2,
      cycleLife: 1000,
      published: true,
      featured: true,
      translations: {
        create: [
          { locale: 'en', name: 'Aeroride 460-X eVTOL Series' },
          { locale: 'zh', name: 'Aeroride 460-X eVTOL 系列' },
        ],
      },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`✅ ${products.length} products created`);

  // ===== Banners =====
  const banners = [
    {
      title: 'Aeroride 460-X Series',
      subtitle: '460 Wh/kg Energy Density',
      ctaText: 'Learn More',
      titleZh: 'Aeroride 460-X 系列',
      subtitleZh: '460 Wh/kg 能量密度',
      ctaTextZh: '了解更多',
      image: '/images/banner/460x-banner.jpg',
      link: '/products/cloudchi-460-x',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Swift Safe Energy',
      subtitle: 'Powering Tomorrow\'s Mobility',
      ctaText: 'About Us',
      titleZh: '深安锂能',
      subtitleZh: '驱动未来出行',
      ctaTextZh: '关于我们',
      image: '/images/banner/sse-banner.jpg',
      link: '/about',
      isActive: true,
      sortOrder: 2,
    },
  ];

  for (const banner of banners) {
    // Use raw SQL to bypass Prisma client expectation of mediaType column
    const existing: any = await prisma.$queryRaw`SELECT id FROM banners WHERE title = ${banner.title} LIMIT 1`;
    if (!existing || (Array.isArray(existing) && existing.length === 0)) {
      await prisma.$executeRaw`
        INSERT INTO banners (id, title, subtitle, "ctaText", "titleZh", "subtitleZh", "ctaTextZh", image, link, "isActive", "sortOrder", "createdAt", "updatedAt")
        VALUES (
          ${`banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`},
          ${banner.title},
          ${banner.subtitle},
          ${banner.ctaText},
          ${banner.titleZh},
          ${banner.subtitleZh},
          ${banner.ctaTextZh},
          ${banner.image},
          ${banner.link},
          ${banner.isActive},
          ${banner.sortOrder},
          NOW(),
          NOW()
        )
      `;
    }
  }
  console.log(`✅ ${banners.length} banners created`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });