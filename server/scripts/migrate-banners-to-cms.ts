/**
 * One-time migration: banners table → home page CMS content (page_contents).
 * Reads existing banners and writes home.hero content for en/zh.
 * Idempotent: skips if home/en already has hero content.
 */
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: 'asc' },
    where: { isActive: true },
  });

  if (banners.length === 0) {
    console.log('No active banners — nothing to migrate.');
    return;
  }

  const buildHero = (locale: 'en' | 'zh') => {
    const slides = banners.map((b, i) => ({
      id: i + 1,
      mediaType: b.mediaType ?? 'IMAGE',
      image: b.image,
      videoUrl: b.videoUrl,
      posterUrl: b.posterUrl,
      mobileImage: b.mobileImage,
      mobileVideoUrl: b.mobileVideoUrl,
      title: locale === 'zh' ? b.titleZh || b.title : b.title,
      subtitle: locale === 'zh' ? b.subtitleZh || b.subtitle : b.subtitle,
      ctaText: locale === 'zh' ? b.ctaTextZh || b.ctaText : b.ctaText,
      ctaLink: b.link,
    }));
    return { hero: { slides } };
  };

  for (const locale of ['en', 'zh'] as const) {
    const existing = await prisma.pageContent.findUnique({
      where: { page_locale: { page: 'home', locale } },
    });
    const current = (existing?.content ?? {}) as Record<string, unknown>;
    const hero = current.hero as Record<string, unknown> | undefined;

    // Skip if hero already populated by the CMS editor.
    if (hero && Object.keys(hero).length > 0) {
      console.log(`home/${locale} already has hero content — skipped`);
      continue;
    }

    await prisma.pageContent.upsert({
      where: { page_locale: { page: 'home', locale } },
      update: { content: { ...current, ...buildHero(locale) } },
      create: { page: 'home', locale, content: buildHero(locale) },
    });
    console.log(`home/${locale} hero migrated from ${banners.length} banners`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
