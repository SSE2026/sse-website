// News data from the old website (真实新闻内容)
export interface NewsItem {
  id: number
  slug: string
  date: string
  category: "COMPANY" | "TECHNOLOGY" | "PRODUCT" | "INDUSTRY"
  title: string
  image: string
  excerpt?: string
}

export const newsItems: NewsItem[] = [
  {
    id: 22,
    slug: "ai-electrochemistry",
    date: "2026-08-04",
    category: "TECHNOLOGY",
    title: '【深安前沿】让AI"懂电化学"，物理增强AI将航空电池电解液研发提速近4倍',
    image: "/images/news/ai-electrochemistry.jpg",
  },
  {
    id: 21,
    slug: "industrialization-delivery",
    date: "2026-07-16",
    category: "COMPANY",
    title: '赋能"空天地海"，迈向产业化交付新阶段',
    image: "/images/news/industrialization.jpg",
  },
  {
    id: 20,
    slug: "low-altitude-logistics",
    date: "2026-07-14",
    category: "INDUSTRY",
    title: "【行业观察】政策驱动低空物流产业化，高能量密度电池解锁无人机载重与航程新边界",
    image: "/images/news/low-altitude-logistics.jpg",
  },
  {
    id: 19,
    slug: "yunichi-460x",
    date: "2026-06-18",
    category: "PRODUCT",
    title: "【重磅发布】460Wh/kg 无负极电池登场！深安锂能云驰 460-X 解锁极限动力新边界",
    image: "/images/news/yunchi-460x.jpg",
  },
  {
    id: 18,
    slug: "liugong-partnership",
    date: "2026-04-27",
    category: "COMPANY",
    title: "战略携手 共筑新能｜深安锂能与柳工签署合作协议，共推工程机械固态电池系统关键技术研发与产业化",
    image: "/images/news/liugong-partnership.jpg",
  },
  {
    id: 17,
    slug: "trillion-low-altitude",
    date: "2026-03-16",
    category: "INDUSTRY",
    title: "【行业观察】万亿低空 × 万亿具身：下一代产业的天花板，其实卡在电池里",
    image: "/images/news/trillion-low-altitude.jpg",
  },
  {
    id: 16,
    slug: "angel-funding",
    date: "2025-10-27",
    category: "COMPANY",
    title: "深安锂能完成数千万天使轮融资 加快高比能超充固态电池产业化",
    image: "/images/news/angel-funding.jpg",
  },
  {
    id: 15,
    slug: "cibf2025",
    date: "2025-05-19",
    category: "TECHNOLOGY",
    title: "「深安锂能」携下一代超充固态电池技术亮相CIBF2025，创始人杨晓光教授发表演讲",
    image: "/images/news/cibf2025.jpg",
  },
]

export const categories = ["ALL", "COMPANY", "TECHNOLOGY", "PRODUCT", "INDUSTRY"] as const
export type Category = (typeof categories)[number]

export const getCategoryLabel = (category: Category, locale: string) => {
  const labels: Record<Category, { en: string; zh: string }> = {
    ALL: { en: "All", zh: "全部" },
    COMPANY: { en: "Company", zh: "公司动态" },
    TECHNOLOGY: { en: "Technology", zh: "技术前沿" },
    PRODUCT: { en: "Product", zh: "产品发布" },
    INDUSTRY: { en: "Industry", zh: "行业观察" },
  }
  return labels[category][locale === "zh" ? "zh" : "en"]
}

export const getNewsByCategory = (category: Category) => {
  if (category === "ALL") return newsItems
  return newsItems.filter((item) => item.category === category)
}
