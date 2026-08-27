require('dotenv').config({path: '.env.local'});
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

// Real finalized news content from data/news.ts (8 articles, the actual SSE news)
const NEWS_DATA = [
  {
    slug: 'ai-electrochemistry',
    coverImage: '/images/news/ai-electrochemistry.jpg',
    category: 'TECHNOLOGY',
    zh: {
      title: '【深安前沿】让AI"懂电化学"，物理增强AI将航空电池电解液研发提速近4倍',
      excerpt: '深安锂能通过物理增强 AI 模型，将航空电池电解液的研发周期缩短近 4 倍。',
      content: '<p>深安锂能通过物理增强 AI 模型，将航空电池电解液的研发周期缩短近 4 倍。该模型将第一性原理计算与实验数据深度融合，可预测电解液体系的离子电导率、氧化稳定性与界面兼容性，大幅减少湿实验迭代次数，为下一代高比能固态电池的快速迭代提供新范式。</p>',
    },
    en: {
      title: 'AI-Accelerated Electrolyte R&D: Physics-Enhanced AI Speeds Aviation Battery Development Nearly 4×',
      excerpt: 'SSE uses physics-enhanced AI to cut aviation battery electrolyte R&D cycles by nearly 4×.',
      content: '<p>SSE applies physics-enhanced AI to cut aviation-battery electrolyte R&D cycles by nearly 4×. The model couples first-principles calculations with experimental data, predicting ionic conductivity, oxidative stability, and interface compatibility, dramatically reducing wet-lab iteration.</p>',
    },
  },
  {
    slug: 'industrialization-delivery',
    coverImage: '/images/news/industrialization.jpg',
    category: 'COMPANY',
    zh: {
      title: '赋能"空天地海"，迈向产业化交付新阶段',
      excerpt: '深安锂能完成新一代高比能固态电池产线贯通，迈入产业化交付新阶段。',
      content: '<p>深安锂能完成新一代高比能固态电池产线贯通，正式迈入产业化交付新阶段。产线覆盖电芯、模组到 Pack 的全流程工艺，可同时服务低空飞行、具身智能、深海装备等"空天地海"边界场景。</p>',
    },
    en: {
      title: 'Empowering "Air, Land, Sea" — Entering a New Stage of Industrial-Scale Delivery',
      excerpt: 'SSE completes its next-gen high-energy-density solid-state battery production line, entering industrial delivery.',
      content: '<p>SSE completes its next-generation high-energy-density solid-state battery line, entering industrial delivery. The line covers cell, module and pack processes, serving low-altitude flight, embodied AI, and deep-sea equipment scenarios.</p>',
    },
  },
  {
    slug: 'low-altitude-logistics',
    coverImage: '/images/news/low-altitude-logistics.jpg',
    category: 'INDUSTRY',
    zh: {
      title: '【行业观察】政策驱动低空物流产业化，高能量密度电池解锁无人机载重与航程新边界',
      excerpt: '政策推动低空物流产业化，高能量密度电池成为无人机载重与航程突破的关键。',
      content: '<p>随着低空经济政策密集出台，无人机物流产业化进程加速。载重与航程的核心瓶颈正在从动力系统转向能源系统——400Wh/kg 以上能量密度的固态电池正成为新一轮分水岭。</p>',
    },
    en: {
      title: 'Policy-Driven Low-Altitude Logistics: High Energy Density Batteries Unlock New UAV Boundaries',
      excerpt: 'Policy accelerates low-altitude logistics industrialization; high-energy-density batteries are key to UAV payload and range.',
      content: '<p>Policy is accelerating low-altitude logistics industrialization. Payload and range bottlenecks are shifting from powertrains to energy systems—400+ Wh/kg solid-state batteries are the new dividing line.</p>',
    },
  },
  {
    slug: 'yunichi-460x',
    coverImage: '/images/news/yunchi-460x.jpg',
    category: 'PRODUCT',
    zh: {
      title: '【重磅发布】460Wh/kg 无负极电池登场！深安锂能云驰 460-X 解锁极限动力新边界',
      excerpt: '深安锂能正式发布云驰 460-X 无负极电池，能量密度达 460Wh/kg。',
      content: '<p>深安锂能正式发布云驰 460-X 无负极电池，单体能量密度达 460Wh/kg。该产品采用无负极结构 + 半固态电解质，循环寿命与安全性同步突破，为 eVTOL、高端无人机、具身机器人等极限动力场景提供新一代能源解决方案。</p>',
    },
    en: {
      title: '460 Wh/kg Anode-Free Battery Launched: SSE Yunchi 460-X Redefines Extreme Power',
      excerpt: 'SSE launches Yunchi 460-X anode-free battery with 460 Wh/kg energy density.',
      content: '<p>SSE launches the Yunchi 460-X anode-free battery at 460 Wh/kg. Anode-free architecture with a semi-solid electrolyte delivers breakthroughs in cycle life and safety, targeting eVTOL, premium UAVs, and embodied robotics.</p>',
    },
  },
  {
    slug: 'liugong-partnership',
    coverImage: '/images/news/liugong-partnership.jpg',
    category: 'COMPANY',
    zh: {
      title: '战略携手 共筑新能｜深安锂能与柳工签署合作协议，共推工程机械固态电池系统关键技术研发与产业化',
      excerpt: '深安锂能与柳工签署战略合作协议，共推工程机械固态电池系统产业化。',
      content: '<p>深安锂能与广西柳工签署战略合作协议，双方将围绕工程机械固态电池系统的关键技术研发与产业化展开深度合作，共同推动新能源工程机械的规模化落地。</p>',
    },
    en: {
      title: 'Strategic Partnership: SSE and LiuGong Sign Cooperation Agreement on Solid-State Battery Systems for Construction Machinery',
      excerpt: 'SSE and LiuGong sign a strategic cooperation agreement to industrialize solid-state battery systems for construction machinery.',
      content: '<p>SSE and LiuGong sign a strategic cooperation agreement to jointly develop and industrialize solid-state battery systems for construction machinery, accelerating the large-scale adoption of new-energy construction equipment.</p>',
    },
  },
  {
    slug: 'trillion-low-altitude',
    coverImage: '/images/news/trillion-low-altitude.jpg',
    category: 'INDUSTRY',
    zh: {
      title: '【行业观察】万亿低空 × 万亿具身：下一代产业的天花板，其实卡在电池里',
      excerpt: '万亿低空与万亿具身赛道的上限，正被电池能量密度所定义。',
      content: '<p>低空经济与具身智能被普遍视为下一代万亿赛道。但其规模化天花板并非算法或硬件，而是能源——高比能、高安全、高功率固态电池的成熟度，将决定两大产业能跑多远。</p>',
    },
    en: {
      title: 'Trillion-Yuan Low-Altitude × Trillion-Yuan Embodied AI: The Ceiling Is the Battery',
      excerpt: 'The trillion-yuan low-altitude and embodied-AI tracks are bounded by battery energy density.',
      content: '<p>Low-altitude economy and embodied AI are widely seen as the next trillion-yuan tracks. Their scale ceiling is not algorithms or hardware, but energy—mature high-energy, high-safety, high-power solid-state batteries will define how far they can go.</p>',
    },
  },
  {
    slug: 'angel-funding',
    coverImage: '/images/news/angel-funding.jpg',
    category: 'COMPANY',
    zh: {
      title: '深安锂能完成数千万天使轮融资 加快高比能超充固态电池产业化',
      excerpt: '深安锂能完成数千万天使轮融资，加速高比能超充固态电池产业化。',
      content: '<p>深安锂能宣布完成数千万人民币天使轮融资，资金将主要用于高比能超充固态电池的中试线建设、核心团队扩充以及下一代电解质材料的研发，以加快产业化进程。</p>',
    },
    en: {
      title: 'SSE Closes Tens-of-Millions Angel Round to Accelerate High-Energy Ultra-Fast-Charging Solid-State Battery Industrialization',
      excerpt: 'SSE closes a tens-of-millions RMB angel round to accelerate industrialization of high-energy ultra-fast-charging solid-state batteries.',
      content: '<p>SSE closes a tens-of-millions RMB angel round. The funds will accelerate pilot-line construction, team expansion, and next-generation electrolyte R&D for high-energy ultra-fast-charging solid-state batteries.</p>',
    },
  },
  {
    slug: 'cibf2025',
    coverImage: '/images/news/cibf2025.jpg',
    category: 'TECHNOLOGY',
    zh: {
      title: '「深安锂能」携下一代超充固态电池技术亮相CIBF2025，创始人杨晓光教授发表演讲',
      excerpt: '深安锂能携下一代超充固态电池技术亮相 CIBF2025，创始人杨晓光教授发表主题演讲。',
      content: '<p>在第十六届深圳国际电池技术交流会（CIBF2025）上，深安锂能携下一代超充固态电池技术亮相，创始人杨晓光教授发表主题演讲，分享公司在高比能、高安全、极速充电三大方向上的最新进展。</p>',
    },
    en: {
      title: 'SSE Showcases Next-Generation Ultra-Fast-Charging Solid-State Battery at CIBF2025; Founder Prof. Yang Xiaoguang Delivers Keynote',
      excerpt: 'SSE showcases its next-generation ultra-fast-charging solid-state battery at CIBF2025; founder Prof. Yang Xiaoguang delivers a keynote.',
      content: '<p>At the 16th China International Battery Fair (CIBF2025) in Shenzhen, SSE showcases its next-generation ultra-fast-charging solid-state battery. Founder Prof. Yang Xiaoguang delivers a keynote on breakthroughs in energy density, safety, and extreme fast charging.</p>',
    },
  },
];

const CATEGORY_MAP = {
  TECHNOLOGY: 'bc-2',
  COMPANY: 'bc-1',
  INDUSTRY: 'bc-4',
  PRODUCT: 'bc-3',
};

(async () => {
  try {
    // Clean up partial data
    await p.$executeRaw`DELETE FROM blog_post_translations`;
    await p.$executeRaw`DELETE FROM blog_posts`;
    await p.$executeRaw`DELETE FROM blog_category_translations`;
    await p.$executeRaw`DELETE FROM blog_categories`;

    // Blog Categories (re-create to be safe)
    await p.$executeRaw`INSERT INTO blog_categories (id, slug, "createdAt", "updatedAt") VALUES
      ('bc-1', 'company', NOW(), NOW()),
      ('bc-2', 'technology', NOW(), NOW()),
      ('bc-3', 'product', NOW(), NOW()),
      ('bc-4', 'industry', NOW(), NOW())`;

    await p.$executeRaw`INSERT INTO blog_category_translations (id, "categoryId", locale, name) VALUES
      ('bct-1', 'bc-1', 'en', 'Company News'),
      ('bct-2', 'bc-1', 'zh', '公司动态'),
      ('bct-3', 'bc-2', 'en', 'Technology'),
      ('bct-4', 'bc-2', 'zh', '技术前沿'),
      ('bct-5', 'bc-3', 'en', 'Product'),
      ('bct-6', 'bc-3', 'zh', '产品发布'),
      ('bct-7', 'bc-4', 'en', 'Industry'),
      ('bct-8', 'bc-4', 'zh', '行业观察')`;

    // Blog Posts (only update the news - leave products/banners as-is)
    for (let i = 0; i < NEWS_DATA.length; i++) {
      const n = NEWS_DATA[i];
      const id = `bp-${i + 1}`;
      const categoryId = CATEGORY_MAP[n.category];
      // Date: descending order — first item is newest
      // Use the actual dates from data/news.ts, but mapped to descending order
      // data/news.ts order: 22,21,20,19,18,17,16,15 — id 22 is newest
      // We assign publishedAt so the order matches (newest first)
      const dates = ['2026-08-04', '2026-07-16', '2026-07-14', '2026-06-18', '2026-04-27', '2026-03-16', '2025-10-27', '2025-05-19'];
      const publishedAt = dates[i] + ' 00:00:00+00';

      await p.$executeRaw`INSERT INTO blog_posts (id, slug, "coverImage", "authorName", "categoryId", tags, excerpt, content, published, featured, "publishedAt", "createdAt", "updatedAt") VALUES
        (${id}, ${n.slug}, ${n.coverImage}, ${'深安锂能官方'}, ${categoryId}, ${[n.category.toLowerCase()]}, ${n.zh.excerpt}, ${n.zh.content}, true, ${i === 0}, ${publishedAt}::timestamptz, NOW(), NOW())`;

      await p.$executeRaw`INSERT INTO blog_post_translations (id, "blogPostId", locale, title, excerpt, content, "createdAt", "updatedAt") VALUES
        (${id + '-zh'}, ${id}, 'zh', ${n.zh.title}, ${n.zh.excerpt}, ${n.zh.content}, NOW(), NOW()),
        (${id + '-en'}, ${id}, 'en', ${n.en.title}, ${n.en.excerpt}, ${n.en.content}, NOW(), NOW())`;
    }

    const counts = {
      blogPosts: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM blog_posts`)[0].c,
      blogTranslations: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM blog_post_translations`)[0].c,
    };
    console.log('News counts:', JSON.stringify(counts, null, 2));
  } catch(e) {
    console.log('ERROR:', e.message);
    console.log(e.stack);
  } finally {
    await p.$disconnect();
  }
})();