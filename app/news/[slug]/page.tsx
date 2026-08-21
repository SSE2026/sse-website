"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Tag, Loader2, AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsCTA } from "@/components/news/NewsCTA";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

// Types
interface NewsDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  authorName: string | null;
  category: { id: string; slug: string; name: string } | null;
  tags: string[];
  publishedAt: string | null;
  viewCount: number;
  translations: Array<{
    locale: string;
    title: string;
    excerpt: string | null;
    content: string | null;
  }>;
}

interface NewsDetailResponse {
  success: boolean;
  data?: NewsDetail;
  error?: string;
}

interface RelatedNewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

interface RelatedNewsResponse {
  success: boolean;
  items: RelatedNewsItem[];
}

// Category label helper
const getCategoryLabel = (categorySlug: string | null | undefined, locale: string) => {
  const labels: Record<string, { en: string; zh: string }> = {
    technology: { en: "Technology", zh: "技术前沿" },
    business: { en: "Business", zh: "业务动态" },
    company: { en: "Company", zh: "公司动态" },
    product: { en: "Product", zh: "产品发布" },
    industry: { en: "Industry", zh: "行业观察" },
    report: { en: "Report", zh: "行业报告" },
  };
  const label = labels[categorySlug?.toLowerCase() || ""];
  if (label) return label[locale === "zh" ? "zh" : "en"];
  return locale === "zh" ? "新闻" : "News";
};

// Transform for related news display
const transformRelatedNews = (item: RelatedNewsItem) => ({
  id: parseInt(item.id, 36),
  slug: item.slug,
  title: item.title,
  image: item.coverImage || "/images/news/placeholder.jpg",
  date: item.publishedAt
    ? new Date(item.publishedAt).toISOString().split("T")[0]
    : "",
});

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const currentMessages = messages[locale];
  const isZh = locale === "zh";

  // State
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news detail
  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const targetLocale = locale === "zh" ? "zh-CN" : "en";
        const response = await fetch(`/api/news/${slug}?locale=${targetLocale}`);
        const data: NewsDetailResponse = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setError("Article not found");
            return;
          }
          throw new Error(data.error || "Failed to load article");
        }

        if (!data.data) {
          setError(data.error || "Article not found");
          return;
        }

        setNews(data.data);

        // Fetch related news
        const relatedResponse = await fetch(`/api/news?locale=${targetLocale}&limit=3`);
        if (relatedResponse.ok) {
          const relatedData: RelatedNewsResponse = await relatedResponse.json();
          if (relatedData.success) {
            // Filter out current article
            setRelatedNews(
              (relatedData.items || []).filter((item) => item.slug !== slug).slice(0, 2)
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [slug, locale]);

  // Get localized content
  const getLocalizedContent = () => {
    if (!news) return "";

    const targetLocale = isZh ? "zh-CN" : "en";
    const translation = news.translations?.find((t) => t.locale === targetLocale);

    if (translation?.content) return translation.content;
    if (news.content) return news.content;

    // Fallback to other translation
    const otherTranslation = news.translations?.[0];
    return otherTranslation?.content || "";
  };

  const getLocalizedTitle = () => {
    if (!news) return "";

    const targetLocale = isZh ? "zh-CN" : "en";
    const translation = news.translations?.find((t) => t.locale === targetLocale);

    if (translation?.title) return translation.title;
    if (news.title) return news.title;
    return news.translations?.[0]?.title || "";
  };

  const getLocalizedExcerpt = () => {
    if (!news) return "";

    const targetLocale = isZh ? "zh-CN" : "en";
    const translation = news.translations?.find((t) => t.locale === targetLocale);

    return translation?.excerpt || news.excerpt || "";
  };

  // Format date
  const formattedDate = news?.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString(isZh ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Simple markdown-like renderer
  const renderContent = (text: string) => {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, i) => {
      if (para.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-medium text-[#111111] mt-8 mb-3">
            {para.replace("## ", "")}
          </h2>
        );
      }
      if (para.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-medium text-[#111111] mt-6 mb-2">
            {para.replace("### ", "")}
          </h3>
        );
      }
      if (para.startsWith("| ")) {
        const rows = para.split("\n").filter((line) => line.trim());
        const headerCells = rows[0].split("|").filter(Boolean).map((cell) => cell.trim());
        const bodyRows = rows.slice(2).map((row) => row.split("|").filter(Boolean).map((cell) => cell.trim()));

        return (
          <div key={i} className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {headerCells.map((cell, j) => (
                    <th key={j} className="text-left py-2 pr-4 font-medium text-[#555555]">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, j) => (
                  <tr key={j} className="border-b border-[#E5E7EB] last:border-b-0">
                    {row.map((cell, k) => (
                      <td key={k} className="py-2 pr-4 text-[#111111]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      if (para.startsWith("- ")) {
        const items = para.split("\n").filter((line) => line.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-[#555555]">
            {items.map((item, j) => (
              <li key={j}>{item.replace("- ", "")}</li>
            ))}
          </ul>
        );
      }
      if (para.startsWith("**") && para.endsWith("**")) {
        return <p key={i} className="font-medium text-[#111111] my-4">{para.replace(/\*\*/g, "")}</p>;
      }
      if (para.startsWith("**")) {
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-[#555555] leading-relaxed my-4">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} className="font-medium text-[#111111]">{part.replace(/\*\*/g, "")}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
      return <p key={i} className="text-[#555555] leading-relaxed my-4">{para}</p>;
    });
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        />
        <main className="min-h-screen bg-[#F7F8FA] pt-[72px] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
        </main>
        <Footer translations={currentMessages} locale={locale} />
      </>
    );
  }

  // Error state
  if (error || !news) {
    return (
      <>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        />
        <main className="min-h-screen bg-[#F7F8FA] pt-[72px] flex flex-col items-center justify-center">
          <AlertCircle className="w-16 h-16 text-[#EF4444] mb-4" />
          <h2 className="text-2xl font-semibold text-[#111111] mb-2">
            {isZh ? "文章未找到" : "Article Not Found"}
          </h2>
          <p className="text-[#6B7280] mb-6">{error || (isZh ? "文章不存在或已被删除" : "Article does not exist or has been removed")}</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white bg-[#111111] hover:bg-[#333333] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isZh ? "返回新闻列表" : "Back to News"}
          </Link>
        </main>
        <Footer translations={currentMessages} locale={locale} />
      </>
    );
  }

  const title = getLocalizedTitle();
  const content = getLocalizedContent();
  const excerpt = getLocalizedExcerpt();
  const relatedTransformed = relatedNews.map(transformRelatedNews);

  return (
    <>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
      />

      <main className="min-h-screen bg-[#F7F8FA] pt-[72px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="py-4">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-[13px] text-[#8A8F98] hover:text-[#555555] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isZh ? "返回新闻列表" : "Back to News"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <section className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="py-10 lg:py-14 max-w-[900px]">
              {/* Category and Date */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-5"
              >
                <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#155EEF]">
                  {getCategoryLabel(news.category?.slug, locale)}
                </span>
                {formattedDate && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                    <span className="text-[13px] text-[#8A8F98]">{formattedDate}</span>
                  </>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[28px] lg:text-[36px] font-medium leading-[1.25] text-[#111111] mb-6"
              >
                {title}
              </motion.h1>

              {/* Featured Image */}
              {news.coverImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative aspect-[16/9] overflow-hidden bg-[#F7F8FA] mb-8"
                >
                  <Image
                    src={news.coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="max-w-[720px] pb-12 lg:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {content ? renderContent(content) : (
                  <p className="text-[#555555]">{isZh ? "暂无内容" : "No content available"}</p>
                )}
              </motion.div>

              {/* Tags */}
              {news.category && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[#E5E7EB]"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] text-[#8A8F98] border border-[#E5E7EB]">
                    <Tag className="w-3 h-3" />
                    {getCategoryLabel(news.category.slug, locale)}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedTransformed.length > 0 && (
          <section className="bg-[#F7F8FA] border-t border-[#E5E7EB]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
              <div className="py-12 lg:py-16">
                <h2 className="text-[18px] font-medium text-[#111111] mb-6">
                  {isZh ? "相关阅读" : "Related Articles"}
                </h2>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  {relatedTransformed.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="bg-white border border-[#E5E7EB]"
                    >
                      <Link href={`/news/${item.slug}`} className="block group">
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-[#F7F8FA]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-[16px] font-medium leading-[1.4] text-[#111111] group-hover:text-[#155EEF] transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* View All */}
                <div className="mt-8 text-center">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-[#111111] group"
                  >
                    <span>{isZh ? "查看全部新闻" : "View All News"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <NewsCTA locale={locale} />
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  );
}
