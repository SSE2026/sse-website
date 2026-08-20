-- Migration: document_lifecycle
-- Description: Add DocumentStatus enum, nullable file fields, lifecycle timestamps, and FK constraints
-- Created: 2026-08-02

-- Create enum for Document lifecycle status
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'UPLOADING', 'READY', 'PUBLISHED', 'ARCHIVED');

-- ============================================
-- Users & Auth Tables
-- ============================================

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ============================================
-- Companies & Customers
-- ============================================

CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "city" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");
CREATE INDEX "companies_country_idx" ON "companies"("country");
CREATE INDEX "companies_isActive_idx" ON "companies"("isActive");

CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "position" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "source" TEXT NOT NULL DEFAULT 'DIRECT',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "landingPage" TEXT,
    "referrer" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
CREATE INDEX "customers_companyId_idx" ON "customers"("companyId");
CREATE INDEX "customers_country_idx" ON "customers"("country");
CREATE INDEX "customers_source_idx" ON "customers"("source");

ALTER TABLE "customers" ADD CONSTRAINT "customers_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- Product Categories
-- ============================================

CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "icon" TEXT,
    "parentId" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");
CREATE INDEX "product_categories_parentId_idx" ON "product_categories"("parentId");

ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "product_category_translations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "product_category_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_category_translations_categoryId_locale_key" ON "product_category_translations"("categoryId", "locale");

ALTER TABLE "product_category_translations" ADD CONSTRAINT "product_category_translations_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- Products
-- ============================================

CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brand" TEXT,
    "chemistry" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "nominalVoltage" DOUBLE PRECISION,
    "nominalCapacity" DOUBLE PRECISION,
    "energy" DOUBLE PRECISION,
    "energyDensity" DOUBLE PRECISION,
    "chargeRate" DOUBLE PRECISION,
    "dischargeRate" DOUBLE PRECISION,
    "peakDischargeRate" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "cycleLife" INTEGER,
    "operatingTempMin" INTEGER,
    "operatingTempMax" INTEGER,
    "moq" INTEGER,
    "sampleAvailable" BOOLEAN NOT NULL DEFAULT false,
    "customizationAvailable" BOOLEAN NOT NULL DEFAULT false,
    "leadTime" TEXT,
    "specifications" JSONB,
    "features" JSONB,
    "applications" JSONB,
    "technicalNotes" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");
CREATE UNIQUE INDEX "products_model_key" ON "products"("model");
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_published_deletedAt_idx" ON "products"("published", "deletedAt");
CREATE INDEX "products_featured_published_idx" ON "products"("featured", "published");
CREATE INDEX "products_energyDensity_idx" ON "products"("energyDensity");
CREATE INDEX "products_nominalVoltage_idx" ON "products"("nominalVoltage");
CREATE INDEX "products_nominalCapacity_idx" ON "products"("nominalCapacity");

ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "product_translations" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "features" JSONB,
    "technicalNotes" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_translations_productId_locale_key" ON "product_translations"("productId", "locale");
CREATE INDEX "product_translations_locale_idx" ON "product_translations"("locale");

ALTER TABLE "product_translations" ADD CONSTRAINT "product_translations_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "nominalVoltage" DOUBLE PRECISION,
    "nominalCapacity" DOUBLE PRECISION,
    "energy" DOUBLE PRECISION,
    "energyDensity" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "specifications" JSONB,
    "priceUsd" DOUBLE PRECISION,
    "priceUsdMin" DOUBLE PRECISION,
    "priceUsdMax" DOUBLE PRECISION,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");
CREATE UNIQUE INDEX "product_variants_productId_sku_key" ON "product_variants"("productId", "sku");
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");

ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "altEn" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");

ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- Applications
-- ============================================

CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "image" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "applications_slug_key" ON "applications"("slug");

CREATE TABLE "application_translations" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "application_translations_applicationId_locale_key" ON "application_translations"("applicationId", "locale");

ALTER TABLE "application_translations" ADD CONSTRAINT "application_translations_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "product_applications" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_applications_productId_applicationId_key" ON "product_applications"("productId", "applicationId");
CREATE INDEX "product_applications_productId_idx" ON "product_applications"("productId");
CREATE INDEX "product_applications_applicationId_idx" ON "product_applications"("applicationId");

ALTER TABLE "product_applications" ADD CONSTRAINT "product_applications_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_applications" ADD CONSTRAINT "product_applications_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- Inquiries
-- ============================================

CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "inquiryNumber" TEXT NOT NULL,
    "inquiryType" TEXT NOT NULL DEFAULT 'PRODUCT',
    "customerId" TEXT,
    "companyId" TEXT,
    "customerName" TEXT,
    "companyName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "applicationId" TEXT,
    "applicationName" TEXT,
    "productId" TEXT,
    "productName" TEXT,
    "productModel" TEXT,
    "productVariantId" TEXT,
    "variantName" TEXT,
    "variantSku" TEXT,
    "voltageSnapshot" TEXT,
    "capacitySnapshot" TEXT,
    "energySnapshot" TEXT,
    "energyDensitySnapshot" TEXT,
    "weightSnapshot" TEXT,
    "dimensionsSnapshot" TEXT,
    "chargeRateSnapshot" TEXT,
    "dischargeRateSnapshot" TEXT,
    "cycleLifeSnapshot" TEXT,
    "specificationsSnapshot" JSONB,
    "quantity" INTEGER,
    "quantityUnit" TEXT,
    "targetPrice" TEXT,
    "expectedDelivery" TEXT,
    "destinationCountry" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "assignedTo" TEXT,
    "source" TEXT NOT NULL DEFAULT 'DIRECT',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "landingPage" TEXT,
    "referrer" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inquiries_inquiryNumber_key" ON "inquiries"("inquiryNumber");
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");
CREATE INDEX "inquiries_email_idx" ON "inquiries"("email");
CREATE INDEX "inquiries_customerId_idx" ON "inquiries"("customerId");
CREATE INDEX "inquiries_companyId_idx" ON "inquiries"("companyId");
CREATE INDEX "inquiries_productId_idx" ON "inquiries"("productId");
CREATE INDEX "inquiries_inquiryNumber_idx" ON "inquiries"("inquiryNumber");
CREATE INDEX "inquiries_country_idx" ON "inquiries"("country");
CREATE INDEX "inquiries_source_idx" ON "inquiries"("source");
CREATE INDEX "inquiries_createdAt_idx" ON "inquiries"("createdAt");

ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "inquiry_attachments" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiry_attachments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "inquiry_attachments_inquiryId_idx" ON "inquiry_attachments"("inquiryId");

ALTER TABLE "inquiry_attachments" ADD CONSTRAINT "inquiry_attachments_inquiryId_fkey"
    FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "lead_activities" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "customerId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdById" TEXT,
    "createdByName" TEXT,
    "relatedType" TEXT,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lead_activities_inquiryId_idx" ON "lead_activities"("inquiryId");
CREATE INDEX "lead_activities_customerId_idx" ON "lead_activities"("customerId");
CREATE INDEX "lead_activities_createdAt_idx" ON "lead_activities"("createdAt");

ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_inquiryId_fkey"
    FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- Documents (with lifecycle)
-- ============================================

CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "type" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "pages" INTEGER,
    "leadRequired" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "documents_type_idx" ON "documents"("type");
CREATE INDEX "documents_published_idx" ON "documents"("published");
CREATE INDEX "documents_status_idx" ON "documents"("status");

-- ============================================
-- Document Relations
-- ============================================

CREATE TABLE "product_documents" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "product_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_documents_productId_documentId_key" ON "product_documents"("productId", "documentId");
CREATE INDEX "product_documents_productId_idx" ON "product_documents"("productId");
CREATE INDEX "product_documents_documentId_idx" ON "product_documents"("documentId");

ALTER TABLE "product_documents" ADD CONSTRAINT "product_documents_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_documents" ADD CONSTRAINT "product_documents_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "application_documents_applicationId_documentId_key" ON "application_documents"("applicationId", "documentId");
CREATE INDEX "application_documents_applicationId_idx" ON "application_documents"("applicationId");
CREATE INDEX "application_documents_documentId_idx" ON "application_documents"("documentId");

ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "document_downloads" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "source" TEXT NOT NULL DEFAULT 'DIRECT',
    "landingPage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_downloads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "document_downloads_documentId_idx" ON "document_downloads"("documentId");
CREATE INDEX "document_downloads_email_idx" ON "document_downloads"("email");
CREATE INDEX "document_downloads_createdAt_idx" ON "document_downloads"("createdAt");

ALTER TABLE "document_downloads" ADD CONSTRAINT "document_downloads_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================
-- Blog
-- ============================================

CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

CREATE TABLE "blog_category_translations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "blog_category_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_category_translations_categoryId_locale_key" ON "blog_category_translations"("categoryId", "locale");

ALTER TABLE "blog_category_translations" ADD CONSTRAINT "blog_category_translations_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorId" TEXT,
    "authorName" TEXT,
    "categoryId" TEXT,
    "tags" TEXT[] NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE INDEX "blog_posts_published_publishedAt_idx" ON "blog_posts"("published", "publishedAt");
CREATE INDEX "blog_posts_categoryId_idx" ON "blog_posts"("categoryId");

ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "blog_post_translations" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_post_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_post_translations_blogPostId_locale_key" ON "blog_post_translations"("blogPostId", "locale");

ALTER TABLE "blog_post_translations" ADD CONSTRAINT "blog_post_translations_blogPostId_fkey"
    FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- Migration completed
-- Note: _prisma_migrations table is created by Prisma automatically
-- ============================================
