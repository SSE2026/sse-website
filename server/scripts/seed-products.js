require('dotenv').config({path: '.env.local'});
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

const PRODUCTS_DATA = [
  {
    sku: 'SSE10570163',
    model: '云驰 360-P',
    slug: 'cloudchi-360-p',
    energyDensity: 358,
    cycleLife: 2000,
    weight: 4.2,
    nominalVoltage: 3.5,
    nominalCapacity: 25,
    dischargeRate: 5,
    zh: { name: '云驰 360-P 系列', shortDescription: '高能量 + 高功率型电芯，能量密度 358 Wh/kg，循环寿命 2000+ 次，适用于低空飞行与高端动力工具。' },
    en: { name: 'Aeroride 360-P Series', shortDescription: 'High energy + high power cell, 358 Wh/kg, 2000+ cycles, ideal for low-altitude flight and high-end power tools.' },
  },
  {
    sku: 'SSE10750160',
    model: '云驰 400-E',
    slug: 'cloudchi-400-e',
    energyDensity: 400,
    cycleLife: 1500,
    weight: 3.5,
    nominalVoltage: 3.6,
    nominalCapacity: 30,
    dischargeRate: 8,
    zh: { name: '云驰 400-E 系列', shortDescription: '高能量 + 长循环型电芯，能量密度 400 Wh/kg，专为长续航 eVTOL 与具身机器人设计。' },
    en: { name: 'Aeroride 400-E Series', shortDescription: 'High energy + long cycle cell, 400 Wh/kg, designed for long-endurance eVTOL and embodied robotics.' },
  },
  {
    sku: 'SSE10900150',
    model: '云驰 460-X',
    slug: 'cloudchi-460-x',
    energyDensity: 460,
    cycleLife: 1000,
    weight: 2.8,
    nominalVoltage: 3.7,
    nominalCapacity: 28,
    dischargeRate: 10,
    zh: { name: '云驰 460-X 系列', shortDescription: '超高能量 + 超高倍率无负极电芯，能量密度 460 Wh/kg，解锁极限动力新边界。' },
    en: { name: 'Aeroride 460-X Series', shortDescription: 'Ultra-high energy + high-rate anode-free cell, 460 Wh/kg, redefining the extreme power boundary.' },
  },
];

(async () => {
  try {
    // Wipe existing products
    await p.$executeRaw`DELETE FROM product_translations`;
    await p.$executeRaw`DELETE FROM products`;

    // Re-create category
    await p.$executeRaw`DELETE FROM product_categories WHERE id = 'pc-1'`;
    await p.$executeRaw`DELETE FROM product_category_translations WHERE "categoryId" = 'pc-1'`;
    await p.$executeRaw`INSERT INTO product_categories (id, slug, "createdAt", "updatedAt") VALUES ('pc-1', 'high-energy-battery', NOW(), NOW()) ON CONFLICT DO NOTHING`;
    await p.$executeRaw`INSERT INTO product_category_translations (id, "categoryId", locale, name) VALUES
      ('pct-1', 'pc-1', 'en', 'High Energy Battery'),
      ('pct-2', 'pc-1', 'zh', '高能量电池')
      ON CONFLICT DO NOTHING`;

    for (let i = 0; i < PRODUCTS_DATA.length; i++) {
      const p_ = PRODUCTS_DATA[i];
      const id = `pr-${i + 1}`;
      await p.$executeRaw`INSERT INTO products (id, sku, model, slug, "categoryId", brand, chemistry, "shortDescription", "nominalVoltage", "nominalCapacity", "energyDensity", "dischargeRate", weight, "cycleLife", published, featured, "sortOrder", "createdAt", "updatedAt") VALUES
        (${id}, ${p_.sku}, ${p_.model}, ${p_.slug}, 'pc-1', 'Swift Safe Energy', 'NMC', ${p_.zh.shortDescription}, ${p_.nominalVoltage}, ${p_.nominalCapacity}, ${p_.energyDensity}, ${p_.dischargeRate}, ${p_.weight}, ${p_.cycleLife}, true, true, ${i}, NOW(), NOW())`;

      await p.$executeRaw`INSERT INTO product_translations (id, "productId", locale, name, "shortDescription", "createdAt", "updatedAt") VALUES
        (${id + '-zh'}, ${id}, 'zh', ${p_.zh.name}, ${p_.zh.shortDescription}, NOW(), NOW()),
        (${id + '-en'}, ${id}, 'en', ${p_.en.name}, ${p_.en.shortDescription}, NOW(), NOW())`;
    }

    // Update banners to match the new product names
    await p.$executeRaw`DELETE FROM banners`;
    await p.$executeRaw`INSERT INTO banners (id, title, subtitle, "ctaText", "titleZh", "subtitleZh", "ctaTextZh", image, link, "isActive", "sortOrder", "createdAt", "updatedAt") VALUES
      ('bn-1', 'Aeroride 460-X Series', '460 Wh/kg Anode-Free Battery', 'Learn More', '云驰 460-X 系列', '460 Wh/kg 无负极电池', '了解更多', '/images/banner/460x-banner.jpg', '/products/cloudchi-460-x', true, 1, NOW(), NOW()),
      ('bn-2', 'Swift Safe Energy', 'Powering Tomorrow Mobility', 'About Us', '深安锂能', '驱动未来出行', '关于我们', '/images/banner/sse-banner.jpg', '/about', true, 2, NOW(), NOW())`;

    const counts = {
      products: (await p.$queryRaw`SELECT COUNT(*)::int as c FROM products`)[0].c,
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