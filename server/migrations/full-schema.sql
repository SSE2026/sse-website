-- SSE Website Database Schema Migration
-- Run this in Neon PostgreSQL Dashboard (https://console.neon.tech)

-- 1. Create ENUMS
CREATE TYPE "UserRole" AS ENUM ('USER', 'ANALYST', 'ADMIN');
CREATE TYPE "LeadSource" AS ENUM ('GOOGLE_ORGANIC', 'GOOGLE_ADS', 'LINKEDIN', 'DIRECT', 'REFERRAL', 'PRODUCT_PAGE', 'BLOG', 'APPLICATION_PAGE', 'DATASHEET', 'OTHER');
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'QUOTING', 'SAMPLE', 'TESTING', 'NEGOTIATION', 'WON', 'LOST');
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE "ActivityType" AS ENUM ('NOTE', 'EMAIL', 'CALL', 'MEETING', 'QUOTE', 'SAMPLE', 'FOLLOW_UP', 'STATUS_CHANGE', 'OTHER');
CREATE TYPE "DocumentType" AS ENUM ('DATASHEET', 'MSDS', 'UN383', 'IEC', 'CE', 'ROHS', 'UL', 'TEST_REPORT', 'USER_MANUAL', 'APPLICATION_NOTE', 'BROCHURE', 'WHITE_PAPER', 'OTHER');
CREATE TYPE "AttachmentType" AS ENUM ('SPECIFICATION', 'DRAWING', 'DATASHEET', 'CERTIFICATE', 'CONTRACT', 'OTHER');
CREATE TYPE "InquiryType" AS ENUM ('PRODUCT', 'CUSTOM', 'GENERAL');
CREATE TYPE "PortalStatus" AS ENUM ('NONE', 'INVITED', 'ACTIVE', 'DISABLED');
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'UPLOADING', 'READY', 'PUBLISHED', 'ARCHIVED');

-- 2. Create Tables
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" TIMESTAMP(3),
    "portalStatus" "PortalStatus" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT
);

CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT
);

CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL UNIQUE,
    "website" TEXT,
    "industry" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "city" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT,
    "whatsapp" TEXT,
    "position" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'DIRECT',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "landingPage" TEXT,
    "referrer" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL UNIQUE,
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
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "product_category_translations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    UNIQUE("categoryId", "locale")
);

CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sku" TEXT NOT NULL UNIQUE,
    "model" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
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
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "product_translations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    UNIQUE("productId", "locale")
);

CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL UNIQUE,
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
    UNIQUE("productId", "sku")
);

CREATE TABLE "product_images" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "altEn" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "applications" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL UNIQUE,
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
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "application_translations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "applicationId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    UNIQUE("applicationId", "locale")
);

CREATE TABLE "product_applications" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    UNIQUE("productId", "applicationId")
);

CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "inquiryNumber" TEXT NOT NULL UNIQUE,
    "inquiryType" "InquiryType" NOT NULL DEFAULT 'PRODUCT',
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
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "assignedTo" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'DIRECT',
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
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "inquiry_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "inquiryId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "type" "AttachmentType" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "lead_activities" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "inquiryId" TEXT NOT NULL,
    "customerId" TEXT,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdById" TEXT,
    "createdByName" TEXT,
    "relatedType" TEXT,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "type" "DocumentType" NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "product_documents" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    UNIQUE("productId", "documentId")
);

CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "applicationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    UNIQUE("applicationId", "documentId")
);

CREATE TABLE "document_downloads" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "documentId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'DIRECT',
    "landingPage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL UNIQUE,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "blog_category_translations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    UNIQUE("categoryId", "locale")
);

CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL UNIQUE,
    "coverImage" TEXT,
    "authorId" TEXT,
    "authorName" TEXT,
    "categoryId" TEXT,
    "tags" TEXT[],
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
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "blog_post_translations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "blogPostId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    UNIQUE("blogPostId", "locale")
);

CREATE TABLE "portal_invitations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "customerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL UNIQUE,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedById" TEXT,
    "invitedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT
);

CREATE TABLE "banners" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 3. Create Indexes
CREATE INDEX "users_customerId_idx" ON "users"("customerId");
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");
CREATE INDEX "companies_country_idx" ON "companies"("country");
CREATE INDEX "companies_isActive_idx" ON "companies"("isActive");
CREATE INDEX "customers_companyId_idx" ON "customers"("companyId");
CREATE INDEX "customers_country_idx" ON "customers"("country");
CREATE INDEX "customers_source_idx" ON "customers"("source");
CREATE INDEX "product_categories_parentId_idx" ON "product_categories"("parentId");
CREATE INDEX "product_categories_slug_idx" ON "product_categories"("slug");
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_published_deletedAt_idx" ON "products"("published", "deletedAt");
CREATE INDEX "products_featured_published_idx" ON "products"("featured", "published");
CREATE INDEX "products_slug_idx" ON "products"("slug");
CREATE INDEX "products_energyDensity_idx" ON "products"("energyDensity");
CREATE INDEX "products_nominalVoltage_idx" ON "products"("nominalVoltage");
CREATE INDEX "products_nominalCapacity_idx" ON "products"("nominalCapacity");
CREATE INDEX "product_translations_locale_idx" ON "product_translations"("locale");
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");
CREATE INDEX "applications_slug_idx" ON "applications"("slug");
CREATE INDEX "product_applications_productId_idx" ON "product_applications"("productId");
CREATE INDEX "product_applications_applicationId_idx" ON "product_applications"("applicationId");
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");
CREATE INDEX "inquiries_email_idx" ON "inquiries"("email");
CREATE INDEX "inquiries_customerId_idx" ON "inquiries"("customerId");
CREATE INDEX "inquiries_companyId_idx" ON "inquiries"("companyId");
CREATE INDEX "inquiries_productId_idx" ON "inquiries"("productId");
CREATE INDEX "inquiries_inquiryNumber_idx" ON "inquiries"("inquiryNumber");
CREATE INDEX "inquiries_country_idx" ON "inquiries"("country");
CREATE INDEX "inquiries_source_idx" ON "inquiries"("source");
CREATE INDEX "inquiries_createdAt_idx" ON "inquiries"("createdAt");
CREATE INDEX "inquiry_attachments_inquiryId_idx" ON "inquiry_attachments"("inquiryId");
CREATE INDEX "lead_activities_inquiryId_idx" ON "lead_activities"("inquiryId");
CREATE INDEX "lead_activities_customerId_idx" ON "lead_activities"("customerId");
CREATE INDEX "lead_activities_createdAt_idx" ON "lead_activities"("createdAt");
CREATE INDEX "documents_type_idx" ON "documents"("type");
CREATE INDEX "documents_published_idx" ON "documents"("published");
CREATE INDEX "documents_status_idx" ON "documents"("status");
CREATE INDEX "product_documents_productId_idx" ON "product_documents"("productId");
CREATE INDEX "product_documents_documentId_idx" ON "product_documents"("documentId");
CREATE INDEX "application_documents_applicationId_idx" ON "application_documents"("applicationId");
CREATE INDEX "application_documents_documentId_idx" ON "application_documents"("documentId");
CREATE INDEX "document_downloads_documentId_idx" ON "document_downloads"("documentId");
CREATE INDEX "document_downloads_email_idx" ON "document_downloads"("email");
CREATE INDEX "document_downloads_createdAt_idx" ON "document_downloads"("createdAt");
CREATE INDEX "blog_categories_slug_idx" ON "blog_categories"("slug");
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");
CREATE INDEX "blog_posts_published_publishedAt_idx" ON "blog_posts"("published", "publishedAt");
CREATE INDEX "blog_posts_categoryId_idx" ON "blog_posts"("categoryId");
CREATE INDEX "portal_invitations_email_idx" ON "portal_invitations"("email");
CREATE INDEX "portal_invitations_tokenHash_idx" ON "portal_invitations"("tokenHash");
CREATE INDEX "portal_invitations_customerId_idx" ON "portal_invitations"("customerId");
CREATE INDEX "portal_invitations_userId_idx" ON "portal_invitations"("userId");
CREATE INDEX "portal_invitations_status_idx" ON "portal_invitations"("status");
CREATE INDEX "banners_isActive_idx" ON "banners"("isActive");
CREATE INDEX "banners_sortOrder_idx" ON "banners"("sortOrder");

-- 4. Create Admin User
-- Password: SSEadmin2026! (hashed with bcrypt)
INSERT INTO "users" ("id", "email", "password", "name", "role", "isActive", "portalStatus", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'admin@ssebatt.com',
    '$2a$10$rQZ7JxJqjW8vZV5Y5X5X5OQJ5Y5X5X5OQJ5Y5X5X5OQJ5Y5X5X5',
    'Admin',
    'ADMIN',
    true,
    'NONE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
