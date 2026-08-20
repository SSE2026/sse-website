import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shensafu.com' },
    update: {},
    create: {
      email: 'admin@shensafu.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // 创建测试用户
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log('✅ Created test user:', user.email);

  // 创建行业数据
  const industries = [
    {
      slug: 'oil',
      name: '石油化工',
      nameEn: 'Petroleum & Petrochemical',
      description: '石油化工行业是现代工业的基础，涵盖从原油勘探开采到终端应用的完整产业链。',
    },
    {
      slug: 'semiconductor',
      name: '半导体',
      nameEn: 'Semiconductor',
      description: '半导体产业是现代电子信息技术的基础，涵盖从设计到制造的完整产业链。',
    },
    {
      slug: 'ev',
      name: '新能源汽车',
      nameEn: 'New Energy Vehicle',
      description: '新能源汽车产业链涵盖从上游原材料到整车制造的全流程。',
    },
    {
      slug: 'humanoid',
      name: '人形机器人',
      nameEn: 'Humanoid Robot',
      description: '人形机器人产业链涵盖核心零部件到整机集成的全流程。',
    },
  ];

  for (const ind of industries) {
    const industry = await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {},
      create: ind,
    });
    console.log('✅ Created industry:', industry.name);

    // 创建产业链节点
    const nodes = [
      { name: '上游资源', level: 'UPSTREAM', sortOrder: 1 },
      { name: '中游制造', level: 'MIDSTREAM', sortOrder: 2 },
      { name: '下游应用', level: 'DOWNSTREAM', sortOrder: 3 },
    ];

    for (const node of nodes) {
      await prisma.chainNode.upsert({
        where: { id: `${industry.id}-${node.name}` },
        update: {},
        create: {
          id: `${industry.id}-${node.name}`,
          industryId: industry.id,
          ...node,
          description: `${node.name}的详细描述`,
          physicalProcess: '原料 → 加工 → 成品',
          businessModel: '规模化生产',
          profitLogic: '产能利用率 × 毛利率',
          cycle: '行业周期',
        },
      });
    }
  }

  // 创建公司数据
  const companies = [
    { code: '600938', name: '中国海油', exchange: '上海证券交易所', business: '海上油气资源开发' },
    { code: '688981', name: '中芯国际', exchange: '上海证券交易所', business: '晶圆代工' },
    { code: '300750', name: '宁德时代', exchange: '深圳证券交易所', business: '动力电池' },
    { code: '002594', name: '比亚迪', exchange: '深圳证券交易所', business: '整车+电池' },
  ];

  for (const comp of companies) {
    const company = await prisma.company.upsert({
      where: { code: comp.code },
      update: {},
      create: comp,
    });
    console.log('✅ Created company:', company.name);

    // 创建公司基本信息
    await prisma.companyBasicInfo.upsert({
      where: { companyId: company.id },
      update: {},
      create: {
        companyId: company.id,
        established: '2001年',
        listed: '2022年',
        capital: '人民币 111亿元',
        controller: '中国海洋石油集团',
        controllerNature: '国有企业',
        controllerBackground: '国务院国有资产监督管理委员会监管',
        management: ['高管1', '高管2', '高管3'],
      },
    });
  }

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
