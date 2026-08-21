-- CreateBannerModel
-- Migration: add_banner_model
-- Created: 2026-08-21

-- Create banners table
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "ctaText" TEXT,
    "titleZh" TEXT,
    "subtitleZh" TEXT,
    "ctaTextZh" TEXT,
    "image" TEXT NOT NULL,
    "mobileImage" TEXT,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "banners_isActive_idx" ON "banners"("isActive");
CREATE INDEX "banners_sortOrder_idx" ON "banners"("sortOrder");

-- Add comments for documentation
COMMENT ON TABLE "banners" IS 'Homepage Hero Carousel Banners';
COMMENT ON COLUMN "banners"."title" IS 'Banner title (English)';
COMMENT ON COLUMN "banners"."titleZh" IS 'Banner title (Chinese)';
COMMENT ON COLUMN "banners"."subtitle" IS 'Banner subtitle (English)';
COMMENT ON COLUMN "banners"."subtitleZh" IS 'Banner subtitle (Chinese)';
COMMENT ON COLUMN "banners"."ctaText" IS 'CTA button text (English)';
COMMENT ON COLUMN "banners"."ctaTextZh" IS 'CTA button text (Chinese)';
COMMENT ON COLUMN "banners"."image" IS 'Desktop banner image URL';
COMMENT ON COLUMN "banners"."mobileImage" IS 'Mobile banner image URL (optional)';
COMMENT ON COLUMN "banners"."link" IS 'CTA link URL';
COMMENT ON COLUMN "banners"."isActive" IS 'Whether banner is active and shown on homepage';
COMMENT ON COLUMN "banners"."sortOrder" IS 'Display order (lower = first)';
