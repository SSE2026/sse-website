import { notFound } from "next/navigation";
import { newsItems, getNewsBySlug } from "@/data/news";
import { NewsDetailClient } from "./NewsDetailClient";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return <NewsDetailClient item={item} />;
}