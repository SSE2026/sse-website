// Shapes that mirror server/src/modules/products/dto/* and the Prisma model.
// Kept narrow on purpose — only what the admin UI actually consumes.

export type ProductCategory = {
  id: string;
  slug: string;
  published?: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
  altEn?: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductTranslation = {
  id: string;
  locale: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
};

export type ProductListItem = {
  id: string;
  sku: string;
  model: string;
  slug: string;
  categoryId: string;
  category?: { id: string; slug: string };
  published: boolean;
  featured: boolean;
  sortOrder: number;
  nominalVoltage?: number | null;
  nominalCapacity?: number | null;
  energy?: number | null;
  energyDensity?: number | null;
  moq?: number | null;
  shortDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  images?: ProductImage[];
  translations?: ProductTranslation[];
  variants?: Array<{ id: string; sku: string }>;
};

export type ProductDetail = ProductListItem & {
  brand?: string | null;
  chemistry?: string | null;
  description?: string | null;
  chargeRate?: number | null;
  dischargeRate?: number | null;
  peakDischargeRate?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  weight?: number | null;
  cycleLife?: number | null;
  operatingTempMin?: number | null;
  operatingTempMax?: number | null;
  sampleAvailable?: boolean;
  customizationAvailable?: boolean;
  leadTime?: string | null;
  specifications?: Record<string, unknown> | null;
  features?: string[] | null;
  applications?: string[] | null;
  technicalNotes?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  variants?: Array<{
    id: string;
    sku: string;
    name: string;
    nameEn?: string | null;
    nominalVoltage?: number | null;
    nominalCapacity?: number | null;
    energy?: number | null;
    energyDensity?: number | null;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    weight?: number | null;
    specifications?: Record<string, unknown> | null;
    published?: boolean;
    sortOrder?: number;
  }>;
};

export type ProductsListResponse = {
  success?: boolean;
  items: ProductListItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type AdminApiError = {
  success: false;
  error: string;
  status?: number;
};
