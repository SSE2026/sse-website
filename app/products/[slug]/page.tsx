import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SeriesDetailView from "@/components/products/SeriesDetailView";
import { SERIES_ORDER, seriesProfiles, getSeriesBySlug } from "@/data/products";

export function generateStaticParams() {
  return SERIES_ORDER.map((id) => ({ slug: seriesProfiles[id].slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};

  return {
    title: `${series.label.zh} | ${series.label.en}`,
    description: series.hero.description.zh,
  };
}

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  return <SeriesDetailView seriesId={series.id} />;
}
