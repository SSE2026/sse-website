// News data from the old website (真实新闻内容)
// Click on any card jumps directly to the original article on ssebatt.com
export interface NewsItem {
  id: number;
  slug: string;
  date: string;
  category: "COMPANY" | "TECHNOLOGY" | "PRODUCT" | "INDUSTRY";
  title: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  image: string;
  originalUrl: string; // Direct link to the original article page on ssebatt.com
}

export const newsItems: NewsItem[] = [
  {
    id: 22,
    slug: "ai-electrochemistry",
    date: "2026-08-04",
    category: "TECHNOLOGY",
    title: '【深安前沿】让AI"懂电化学"，物理增强AI将航空电池电解液研发提速近4倍',
    titleEn: '[SSE Frontier] AI that "understands electrochemistry" — physics-augmented AI accelerates aviation battery electrolyte R&D by nearly 4×',
    excerpt: '深安锂能研发团队搭建物理增强 AI 模型，让 AI 真正理解航空电池电解液体系，研发周期缩短近 4 倍。',
    excerptEn: 'SSE\'s research team built a physics-augmented AI model that interprets electrochemistry for aviation battery electrolyte design, cutting R&D cycles by nearly 4×.',
    image: "/images/news/ai-electrochemistry.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=22",
  },
  {
    id: 21,
    slug: "industrialization-delivery",
    date: "2026-07-16",
    category: "COMPANY",
    title: '赋能"空天地海"，迈向产业化交付新阶段',
    titleEn: 'Empowering "Air · Space · Ground · Sea" — entering the industrialization delivery phase',
    excerpt: '深安锂能固态电池平台从实验室验证走向规模化交付，覆盖空中、空间、地面、水下全场景。',
    excerptEn: 'SSE\'s solid-state battery platform moves from lab validation to mass delivery across air, space, ground, and underwater applications.',
    image: "/images/news/industrialization.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=21",
  },
  {
    id: 20,
    slug: "low-altitude-logistics",
    date: "2026-07-14",
    category: "INDUSTRY",
    title: "【行业观察】政策驱动低空物流产业化，高能量密度电池解锁无人机载重与航程新边界",
    titleEn: "[Industry View] Policy-driven low-altitude logistics industrialization — high energy-density batteries unlock new drone payload and range frontiers",
    excerpt: '低空物流政策持续推进，高能量密度电池成为无人机载重和航程突破的关键。',
    excerptEn: 'China\'s low-altitude logistics rollout is picking up speed; high energy-density battery breakthroughs are reshaping what commercial drones can carry and how far they can fly.',
    image: "/images/news/low-altitude-logistics.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=20",
  },
  {
    id: 19,
    slug: "yunichi-460x",
    date: "2026-06-18",
    category: "PRODUCT",
    title: "【重磅发布】460Wh/kg 无负极电池登场！深安锂能云驰 460-X 解锁极限动力新边界",
    titleEn: "[Major Release] 460 Wh/kg anode-free battery unveiled — SSE's Aeroride 460-X unlocks new frontiers in extreme power",
    excerpt: '深安锂能发布 460Wh/kg 无负极固态电池——云驰 460-X，面向 eVTOL、人形机器人等极限动力场景。',
    excerptEn: 'SSE launches the Aeroride 460-X at 460 Wh/kg — its first anode-free cell aimed at extreme-power applications such as eVTOL and humanoid robotics.',
    image: "/images/news/yunchi-460x.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=19",
  },
  {
    id: 18,
    slug: "liugong-partnership",
    date: "2026-04-27",
    category: "COMPANY",
    title: "战略携手 共筑新能｜深安锂能与柳工签署合作协议，共推工程机械固态电池系统关键技术研发与产业化",
    titleEn: "Strategic partnership for new energy — SSE signs agreement with LiuGong to co-develop solid-state battery systems for construction machinery",
    excerpt: '深安锂能与柳工签署战略合作协议，共同推进工程机械固态电池系统的研发与产业化。',
    excerptEn: 'SSE and LiuGong sign a strategic cooperation agreement to co-develop solid-state battery systems for electrified construction machinery.',
    image: "/images/news/liugong-partnership.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=18",
  },
  {
    id: 17,
    slug: "trillion-low-altitude",
    date: "2026-03-16",
    category: "INDUSTRY",
    title: "【行业观察】万亿低空 × 万亿具身：下一代产业的天花板，其实卡在电池里",
    titleEn: '[Industry View] Trillion-yuan low-altitude × trillion-yuan embodied AI — the ceiling of next-gen industries is bottlenecked by batteries',
    excerpt: '两个万亿级市场——低空经济与具身智能——共享同一个瓶颈：下一代电池技术。',
    excerptEn: 'Two trillion-yuan markets — low-altitude mobility and embodied AI — share a single bottleneck: the next generation of batteries.',
    image: "/images/news/trillion-low-altitude.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=17",
  },
  {
    id: 16,
    slug: "angel-funding",
    date: "2025-10-27",
    category: "COMPANY",
    title: "深安锂能完成数千万天使轮融资 加快高比能超充固态电池产业化",
    titleEn: "SSE closes tens-of-millions-yuan angel round to accelerate industrialization of high-energy-density ultra-fast-charging solid-state batteries",
    excerpt: '深安锂能完成数千万人民币天使轮融资，资金主要用于高比能超充固态电池的产业化落地。',
    excerptEn: 'SSE closes a tens-of-millions-yuan angel round led by industry investors to scale up its high-energy-density, ultra-fast-charging solid-state battery line.',
    image: "/images/news/angel-funding.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=16",
  },
  {
    id: 15,
    slug: "cibf2025",
    date: "2025-05-19",
    category: "TECHNOLOGY",
    title: "「深安锂能」携下一代超充固态电池技术亮相CIBF2025，创始人杨晓光教授发表演讲",
    titleEn: '"SSE" showcases next-gen ultra-fast-charging solid-state battery tech at CIBF 2025; founder Prof. Yang Xiaoguang delivers keynote',
    excerpt: '深安锂能携下一代超充固态电池技术亮相 CIBF2025，创始人杨晓光教授发表主题演讲。',
    excerptEn: 'SSE debuts its next-generation ultra-fast-charging solid-state battery at CIBF 2025, with founder Prof. Yang Xiaoguang delivering a keynote on the company\'s technology roadmap.',
    image: "/images/news/cibf2025.jpg",
    originalUrl: "http://www.ssebatt.com/page123?article_id=15",
  },
];

export const categories = ["ALL", "COMPANY", "TECHNOLOGY", "PRODUCT", "INDUSTRY"] as const;
export type Category = (typeof categories)[number];

export const getCategoryLabel = (category: Category, locale: string) => {
  const labels: Record<Category, { en: string; zh: string }> = {
    ALL: { en: "All", zh: "全部" },
    COMPANY: { en: "Company", zh: "公司动态" },
    TECHNOLOGY: { en: "Technology", zh: "技术前沿" },
    PRODUCT: { en: "Product", zh: "产品发布" },
    INDUSTRY: { en: "Industry", zh: "行业观察" },
  };
  return labels[category][locale === "zh" ? "zh" : "en"];
};

// Localized helpers — fall back to Chinese when English is missing.
export const getNewsTitle = (item: NewsItem, locale: string): string => {
  if (locale === "zh") return item.title;
  return item.titleEn || item.title;
};

export const getNewsExcerpt = (item: NewsItem, locale: string): string | undefined => {
  if (locale === "zh") return item.excerpt;
  return item.excerptEn || item.excerpt;
};

export const getNewsByCategory = (category: Category) => {
  if (category === "ALL") return newsItems;
  return newsItems.filter((item) => item.category === category);
};

export const getNewsBySlug = (slug: string) => {
  return newsItems.find((item) => item.slug === slug);
};
