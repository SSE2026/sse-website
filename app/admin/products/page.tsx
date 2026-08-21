"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Zap,
  Battery,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/app/admin/layout";

// Types
interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  nominalCapacity?: number;
  energyDensity?: number;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface Product {
  id: string;
  sku: string;
  model: string;
  slug: string;
  published: boolean;
  featured: boolean;
  energyDensity?: number;
  nominalCapacity?: number;
  category?: {
    id: string;
    slug: string;
  };
  variants: ProductVariant[];
  images: ProductImage[];
  translations?: Array<{
    locale: string;
    name: string;
  }>;
  createdAt: string;
}

interface ProductsResponse {
  items: Product[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

interface DeleteConfirm {
  id: string;
  title: string;
}

// Products page translations
const productsTranslations = {
  en: {
    title: "Products Management",
    titleZh: "产品管理",
    subtitle: "Manage CloudChi product series",
    subtitleZh: "管理云驰系列产品",
    searchPlaceholder: "Search products...",
    filter: "Filter",
    product: "Product",
    series: "Series",
    energyDensity: "Energy Density",
    discharge: "Discharge",
    status: "Status",
    actions: "Actions",
    addProduct: "Add Product",
    active: "Active",
    draft: "Draft",
    featured: "Featured",
    loading: "Loading...",
    deleteConfirm: "Are you sure you want to delete this product?",
    deleteSuccess: "Product deleted successfully",
    deleteError: "Failed to delete product",
    delete: "Delete",
    cancel: "Cancel",
    views: "views",
    noProducts: "No products found",
    createFirst: "Create your first product to get started",
    variants: "variants",
  },
  zh: {
    title: "产品管理",
    titleZh: "产品管理",
    subtitle: "管理云驰系列产品",
    subtitleZh: "管理云驰系列产品",
    searchPlaceholder: "搜索产品...",
    filter: "筛选",
    product: "产品",
    series: "系列",
    energyDensity: "能量密度",
    discharge: "放电",
    status: "状态",
    actions: "操作",
    addProduct: "添加产品",
    active: "已发布",
    draft: "草稿",
    featured: "精选",
    loading: "加载中...",
    deleteConfirm: "确定要删除这个产品吗？",
    deleteSuccess: "产品删除成功",
    deleteError: "删除产品失败",
    delete: "删除",
    cancel: "取消",
    views: "次浏览",
    noProducts: "未找到产品",
    createFirst: "创建你的第一个产品",
    variants: "型号",
  },
};

export default function ProductsAdminPage() {
  const { locale } = useAdmin();
  const router = useRouter();
  const t = productsTranslations[locale];

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async (search: string, pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
      });
      if (search) params.set("search", search);

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data: ProductsResponse = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (response.status === 403) {
          router.push("/403");
          return;
        }
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data.items || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotal(data.meta?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Initial fetch
  useEffect(() => {
    fetchProducts(searchQuery, page);
  }, [fetchProducts, searchQuery, page]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/products/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete");
      }

      setDeleteSuccess(true);
      setDeleteConfirm(null);

      // Refresh list
      fetchProducts(searchQuery, page);

      // Clear success message after 3 seconds
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // Get product display name (from translation or model)
  const getProductName = (product: Product) => {
    const translation = product.translations?.find(t => t.locale === "zh-CN" || t.locale === locale);
    return translation?.name || product.model;
  };

  // Get primary image
  const getPrimaryImage = (product: Product) => {
    const primary = product.images?.find(img => img.isPrimary);
    return primary?.url || product.images?.[0]?.url || null;
  };

  // Format energy density
  const formatEnergyDensity = (density?: number) => {
    if (!density) return "-";
    return `${density} Wh/kg`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {locale === "en" ? t.title : t.titleZh}
          </h1>
          <p className="text-white/50 mt-1">
            {total > 0
              ? `${total} ${locale === "zh" ? "个产品" : "products"}`
              : (locale === "zh" ? t.subtitleZh : t.subtitle)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t.addProduct}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          {t.filter}
        </Button>
      </div>

      {/* Success Message */}
      {deleteSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
          <CheckCircle className="w-5 h-5" />
          <span>{t.deleteSuccess}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
          <span className="ml-3 text-white/60">{t.loading}</span>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.10] transition-colors"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-[#1F2937]">
                    {getPrimaryImage(product) ? (
                      <Image
                        src={getPrimaryImage(product)!}
                        alt={getProductName(product)}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Battery className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {product.featured && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30">
                          {t.featured}
                        </span>
                      )}
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.published
                            ? "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30"
                            : "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30"
                        }`}
                      >
                        {product.published ? t.active : t.draft}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-1 line-clamp-1">
                      {getProductName(product)}
                    </h3>
                    <p className="text-sm text-white/40 mb-3 font-mono">
                      {product.model}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        {formatEnergyDensity(product.energyDensity)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {product.variants?.length || 0} {t.variants}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {locale === "zh" ? "预览" : "View"}
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        {locale === "zh" ? "编辑" : "Edit"}
                      </Link>
                      <button
                        onClick={() =>
                          setDeleteConfirm({ id: product.id, title: getProductName(product) })
                        }
                        className="flex items-center justify-center px-3 py-2 text-white/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <Battery className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 mb-2">{t.noProducts}</p>
              <p className="text-white/30 text-sm mb-6">{t.createFirst}</p>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addProduct}
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {locale === "zh" ? "上一页" : "Previous"}
              </Button>
              <span className="text-white/60 px-4">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {locale === "zh" ? "下一页" : "Next"}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t.delete}
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/70 mb-6">
              {t.deleteConfirm}
              <br />
              <span className="text-white font-medium">&ldquo;{deleteConfirm.title}&rdquo;</span>
            </p>

            {deleteError && (
              <div className="mb-4 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                {t.cancel}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {t.delete}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
