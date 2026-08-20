// 直接可运行的报告导出脚本
// 使用方式: node scripts/export-report.js

const docx = require('docx');
const fs = require('fs');
const path = require('path');

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType
} = docx;

// 颜色常量
const COLORS = {
  PRIMARY: '10B981',
  DANGER: 'EF4444',
  WARNING: 'F59E0B',
  INFO: '3B82F6',
  PURPLE: '8B5CF6',
};

// 公司数据
const companyData = {
  basicInfo: {
    name: '中国海洋石油有限公司',
    code: '600938',
    exchange: '上海证券交易所',
    business: '油气资源开发',
    description: '中国海油是中国最大的海上油气生产商，主要从事油气勘探、开发、生产及销售业务。公司拥有丰富的海上油气资源储备，作业区域涵盖中国海域及全球多个国家和地区。'
  },
  actualController: {
    controller: '中国海洋石油集团有限公司',
    nature: '国有企业',
    background: '中国海油集团是中央直属大型国有企业，在中国近海大陆架上拥有丰富的油气资源储量和生产能力。'
  },
  shareholders: {
    top10: [
      { name: '中国海油集团', percentage: 60.48, change: '不变' },
      { name: '香港中央结算', percentage: 6.75, change: '增持' },
      { name: '国家管网集团', percentage: 3.47, change: '新进' },
      { name: '挪威主权基金', percentage: 1.09, change: '增持' },
      { name: '阿布达比投资局', percentage: 1.01, change: '增持' },
    ],
    institutionHolding: '机构持仓比例约28%',
    concentration: '股权高度集中'
  },
  industry: {
    scale: '2024年全球油气市场规模约4.5万亿美元',
    growth: '预计2024-2028年中国油气需求年均增长2-3%',
    cycle: '国际油价处于中高位波动',
    policy: '能源安全战略持续推进'
  },
  industryPosition: {
    tier1: ['中国石油', '中国石化', '中国海油'],
    tier2: ['延长石油', '振华石油'],
    tier3: ['各类民营油服企业'],
    companyPosition: '海上油气开发龙头'
  },
  mainBusiness: [
    { name: '原油销售', revenue: 2850, revenuePercent: 55, grossMargin: 38, trend: 'up', trendNote: '油价高位支撑盈利' },
    { name: '天然气销售', revenue: 1450, revenuePercent: 28, grossMargin: 45, trend: 'up', trendNote: 'LNG价格走强' },
    { name: '油气服务', revenue: 580, revenuePercent: 11, grossMargin: 25, trend: 'stable', trendNote: '稳定贡献' },
    { name: '其他业务', revenue: 280, revenuePercent: 6, grossMargin: 28, trend: 'stable', trendNote: '新能源探索' }
  ],
  financials: {
    years: ['2022', '2023', '2024'],
    revenue: [4222, 4684, 5168],
    revenueGrowth: [71.8, 10.9, 10.3],
    netProfit: [1417, 1236, 1386],
    profitGrowth: [101.5, -12.8, 12.1],
    grossMargin: [54.2, 52.8, 53.5],
    netMargin: [33.6, 26.4, 26.8],
    roe: [23.5, 18.2, 19.1]
  },
  investmentValue: {
    highlights: [
      '桶油成本优势明显，约30美元/桶，处于行业领先水平',
      '资源储量持续增长，产量稳步提升',
      '高分红政策，股息率具有吸引力',
      '深水油气开发技术国内领先'
    ],
    risks: [
      '国际油价波动影响业绩',
      '地缘政治风险',
      '碳中和政策长期影响',
      '资本开支压力大'
    ],
    specialValue: '稀缺海上油气资源标的，国内海上油气开发垄断地位'
  }
};

// 生成报告
async function generateReport() {
  const { basicInfo, actualController, shareholders, industry, industryPosition,
          mainBusiness, financials, investmentValue } = companyData;

  const children = [];

  // 封面
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `《${basicInfo.name}深度研究》`, bold: true, size: 56, font: '微软雅黑', color: COLORS.INFO })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `${basicInfo.code} | ${basicInfo.exchange}`, size: 28, font: '微软雅黑', color: '666666' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: `主营业务：${basicInfo.business}`, size: 24, font: '微软雅黑', color: '888888' })],
    }),
    new Paragraph({ children: [], pageBreakBefore: true })
  );

  // 第一部分
  children.push(
    new Paragraph({ children: [new TextRun({ text: '一、公司是干什么的', bold: true, size: 36, font: '微软雅黑', color: COLORS.INFO })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: basicInfo.description, size: 24, font: '微软雅黑' })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '收入结构（最新年度）：', bold: true, size: 24, font: '微软雅黑' })] })
  );

  // 收入结构表格
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['业务板块', '收入(亿)', '占比', '毛利'].map(text =>
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 22, font: '微软雅黑', color: 'FFFFFF' })] })],
            shading: { fill: COLORS.PURPLE, type: ShadingType.CLEAR },
          })
        ),
      }),
      ...mainBusiness.map((seg, index) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: seg.name, size: 22, font: '微软雅黑' })] })], shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB', type: ShadingType.CLEAR } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(seg.revenue), size: 22, font: '微软雅黑' })] })], shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB', type: ShadingType.CLEAR } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${seg.revenuePercent}%`, size: 22, font: '微软雅黑' })] })], shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB', type: ShadingType.CLEAR } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${seg.grossMargin}%`, size: 22, font: '微软雅黑', color: seg.grossMargin >= 30 ? COLORS.PRIMARY : COLORS.WARNING })] })], shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB', type: ShadingType.CLEAR } }),
          ],
        })
      ),
    ],
  }));

  // 第二部分
  children.push(
    new Paragraph({ children: [], pageBreakBefore: true }),
    new Paragraph({ children: [new TextRun({ text: '二、在产业链中的位置', bold: true, size: 36, font: '微软雅黑', color: COLORS.INFO })] }),
    new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: `第一梯队：${industryPosition.tier1.join('、')}`, bold: true, size: 24, font: '微软雅黑', color: COLORS.PRIMARY })] }),
    new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: `第二梯队：${industryPosition.tier2.join('、')}`, size: 24, font: '微软雅黑', color: COLORS.WARNING })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `公司定位：${industryPosition.companyPosition}`, bold: true, size: 24, font: '微软雅黑', color: COLORS.INFO })] }),
    new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: `市场规模：${industry.scale}`, size: 22, font: '微软雅黑' })] }),
    new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: `行业增速：${industry.growth}`, size: 22, font: '微软雅黑' })] }),
    new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: `周期阶段：${industry.cycle}`, size: 22, font: '微软雅黑' })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `政策环境：${industry.policy}`, size: 22, font: '微软雅黑' })] })
  );

  // 第三部分
  children.push(
    new Paragraph({ children: [], pageBreakBefore: true }),
    new Paragraph({ children: [new TextRun({ text: '三、谁控制这家公司', bold: true, size: 36, font: '微软雅黑', color: COLORS.INFO })] }),
    new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: `实际控制人：${actualController.controller}`, bold: true, size: 24, font: '微软雅黑' })] }),
    new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: `企业性质：${actualController.nature}`, size: 24, font: '微软雅黑' })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `背景说明：${actualController.background}`, size: 24, font: '微软雅黑' })] })
  );

  // 股东表格
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['股东名称', '持股比例', '近期变动'].map(text =>
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 22, font: '微软雅黑', color: 'FFFFFF' })] })],
            shading: { fill: COLORS.INFO, type: ShadingType.CLEAR },
          })
        ),
      }),
      ...shareholders.top10.map((sh, index) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: sh.name, size: 22, font: '微软雅黑' })] })], shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB', type: ShadingType.CLEAR } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${sh.percentage.toFixed(2)}%`, size: 22, font: '微软雅黑', bold: true })] })], shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB', type: ShadingType.CLEAR } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: sh.change, size: 22, font: '微软雅黑', color: sh.change.includes('增持') ? COLORS.PRIMARY : '666666' })] })], shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB', type: ShadingType.CLEAR } }),
          ],
        })
      ),
    ],
  }));

  // 第四部分
  children.push(
    new Paragraph({ children: [], pageBreakBefore: true }),
    new Paragraph({ children: [new TextRun({ text: '四、钱从哪来、到哪去', bold: true, size: 36, font: '微软雅黑', color: COLORS.INFO })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '近三年财务摘要：', bold: true, size: 24, font: '微软雅黑' })] })
  );

  // 财务表格
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['指标', ...financials.years.map(y => `${y}年`)].map((text, i) =>
          new TableCell({
            children: [new Paragraph({ alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 22, font: '微软雅黑', color: 'FFFFFF' })] })],
            shading: { fill: COLORS.INFO, type: ShadingType.CLEAR },
          })
        ),
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '营业收入(亿)', bold: true, size: 22, font: '微软雅黑' })] })], shading: { fill: 'F3F4F6', type: ShadingType.CLEAR } }),
          ...financials.revenue.map((val, i) => new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${val} (+${financials.revenueGrowth[i]}%)`, size: 22, font: '微软雅黑', color: COLORS.PRIMARY })] })], shading: { fill: 'FFFFFF', type: ShadingType.CLEAR } })),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '净利润(亿)', bold: true, size: 22, font: '微软雅黑' })] })], shading: { fill: 'F3F4F6', type: ShadingType.CLEAR } }),
          ...financials.netProfit.map((val, i) => new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${val} (${financials.profitGrowth[i] >= 0 ? '+' : ''}${financials.profitGrowth[i]}%)`, size: 22, font: '微软雅黑', color: financials.profitGrowth[i] >= 0 ? COLORS.PRIMARY : COLORS.DANGER })] })], shading: { fill: 'FFFFFF', type: ShadingType.CLEAR } })),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '毛利率', bold: true, size: 22, font: '微软雅黑' })] })], shading: { fill: 'F3F4F6', type: ShadingType.CLEAR } }),
          ...financials.grossMargin.map((val) => new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${val}%`, size: 22, font: '微软雅黑' })] })], shading: { fill: 'FFFFFF', type: ShadingType.CLEAR } })),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ROE', bold: true, size: 22, font: '微软雅黑' })] })], shading: { fill: 'F3F4F6', type: ShadingType.CLEAR } }),
          ...financials.roe.map((val) => new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${val}%`, size: 22, font: '微软雅黑' })] })], shading: { fill: 'FFFFFF', type: ShadingType.CLEAR } })),
        ],
      }),
    ],
  }));

  // 第五部分
  children.push(
    new Paragraph({ children: [], pageBreakBefore: true }),
    new Paragraph({ children: [new TextRun({ text: '五、投资价值分析', bold: true, size: 36, font: '微软雅黑', color: COLORS.INFO })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '核心投资亮点', bold: true, size: 28, font: '微软雅黑', color: COLORS.PRIMARY })] }),
    ...investmentValue.highlights.map((h, i) =>
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: `${i + 1}. ${h}`, size: 24, font: '微软雅黑' })] })
    ),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '风险提示', bold: true, size: 28, font: '微软雅黑', color: COLORS.WARNING })] }),
    ...investmentValue.risks.map((r, i) =>
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: `${i + 1}. ${r}`, size: 24, font: '微软雅黑' })] })
    ),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '特殊投资价值', bold: true, size: 28, font: '微软雅黑', color: COLORS.PURPLE })] }),
    new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: investmentValue.specialValue, size: 24, font: '微软雅黑', bold: true, color: COLORS.PURPLE })] })
  );

  // 免责声明
  children.push(
    new Paragraph({ children: [], pageBreakBefore: true }),
    new Paragraph({ children: [new TextRun({ text: '六、免责声明', bold: true, size: 32, font: '微软雅黑', color: COLORS.DANGER })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '⚠️ 本报告仅供产业逻辑研究参考，不构成任何投资建议。', size: 20, font: '微软雅黑', color: COLORS.DANGER })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '1. 投资者应自主决策、自担风险。', size: 20, font: '微软雅黑', color: '888888' })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '2. 市场有风险，投资需谨慎。', size: 20, font: '微软雅黑', color: '888888' })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '3. 本平台不对任何直接或间接损失负责。', size: 20, font: '微软雅黑', color: '888888' })] }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: '— 深研智能 产业逻辑研究平台 —', size: 20, font: '微软雅黑', color: COLORS.PRIMARY })] })
  );

  // 创建文档
  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  // 生成文件
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, `${basicInfo.name}深度研究报告.docx`);
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ 报告已生成: ${outputPath}`);
  console.log(`📄 文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);
}

generateReport().catch(console.error);
