"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Types
interface Product {
  id: string;
  sku: string;
  model: string;
  slug: string;
  categoryId: string;
  brand?: string;
  chemistry?: string;
  shortDescription?: string;
  description?: string;
  nominalVoltage?: number;
  nominalCapacity?: number;
  energy?: number;
  energyDensity?: number;
  chargeRate?: number;
  dischargeRate?: number;
  peakDischargeRate?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  cycleLife?: number;
  operatingTempMin?: number;
  operatingTempMax?: number;
  moq?: number;
  sampleAvailable?: boolean;
  customizationAvailable?: boolean;
  leadTime?: string;
  features?: string[];
  applications?: string[];
  specifications?: Record<string, unknown>;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    altEn?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  variants: Array<{
    id: string;
    sku: string;
    name: string;
    nameEn?: string;
    nominalVoltage?: number;
    nominalCapacity?: number;
    energy?: number;
    energyDensity?: number;
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    priceUsd?: number;
    priceUsdMin?: number;
    priceUsdMax?: number;
    published: boolean;
    sortOrder: number;
  }>;
  translations: Array<{
    locale: string;
    name?: string;
    shortDescription?: string;
    description?: string;
    features?: string[];
  }>;
  category?: {
    id: string;
    slug: string;
  };
}

interface ProductResponse {
  success: boolean;
  data?: Product;
  error?: string;
}

// Translations
const translations = {
  en: {
    title: "Add Product",
    titleEdit: "Edit Product",
    basicInfo: "Basic Information",
    name: "Product Name (EN)",
    nameZh: "Product Name (ZH)",
    sku: "SKU",
    model: "Model",
    slug: "URL Slug",
    slugHint: "URL: /products/",
    category: "Category",
    selectCategory: "Select Category",
    chemistry: "Chemistry",
    description: "Description (EN)",
    descriptionZh: "Description (ZH)",
    specifications: "Specifications",
    energyDensity: "Energy Density (Wh/kg)",
    chargeRate: "Charge Rate (C)",
    dischargeRate: "Discharge Rate (C)",
    peakDischarge: "Peak Discharge (C)",
    voltage: "Voltage (V)",
    capacity: "Capacity (Ah)",
    cycleLife: "Cycle Life",
    operatingTemp: "Operating Temp (°C)",
    weight: "Weight (kg)",
    dimensions: "Dimensions (mm)",
    features: "Features",
    addFeature: "Add Feature",
    applications: "Applications",
    images: "Product Images",
    uploadImage: "Upload Image",
    settings: "Settings",
    status: "Status",
    active: "Published",
    draft: "Draft",
    featured: "Featured",
    save: "Save Changes",
    saving: "Saving...",
    cancel: "Cancel",
    viewProduct: "View Product",
    deleteProduct: "Delete Product",
    loading: "Loading...",
    error: "Error",
    success: "Product saved successfully",
    saveError: "Failed to save product",
    required: "Required",
    optional: "Optional",
  },
  zh: {
    title: "添加产品",
    titleEdit: "编辑产品",
    basicInfo: "基本信息",
    name: "产品名称（英文）",
    nameZh: "产品名称（中文）",
    sku: "SKU",
    model: "型号",
    slug: "URL 标识",
    slugHint: "URL: /products/",
    category: "分类",
    selectCategory: "选择分类",
    chemistry: "化学体系",
    description: "描述（英文）",
    descriptionZh: "描述（中文）",
    specifications: "技术规格",
    energyDensity: "能量密度 (Wh/kg)",
    chargeRate: "充电倍率 (C)",
    dischargeRate: "放电倍率 (C)",
    peakDischarge: "峰值放电 (C)",
    voltage: "电压 (V)",
    capacity: "容量 (Ah)",
    cycleLife: "循环寿命",
    operatingTemp: "工作温度 (°C)",
    weight: "重量 (kg)",
    dimensions: "尺寸 (mm)",
    features: "产品特点",
    addFeature: "添加特点",
    applications: "应用场景",
    images: "产品图片",
    uploadImage: "上传图片",
    settings: "设置",
    status: "状态",
    active: "已发布",
    draft: "草稿",
    featured: "精选",
    save: "保存更改",
    saving: "保存中...",
    cancel: "取消",
    viewProduct: "预览产品",
    deleteProduct: "删除产品",
    loading: "加载中...",
    error: "错误",
    success: "产品保存成功",
    saveError: "保存产品失败",
    required: "必填",
    optional: "选填",
  },
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useAdmin();
  const t = translations[locale];
  const productId = params.id as string;
  const isNew = productId === "new";

  // State
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState<{
    sku: string;
    model: string;
    slug: string;
    categoryId: string;
    chemistry: string;
    shortDescription: string;
    description: string;
    shortDescriptionZh: string;
    descriptionZh: string;
    nominalVoltage: string;
    nominalCapacity: string;
    energyDensity: string;
    chargeRate: string;
    dischargeRate: string;
    peakDischargeRate: string;
    length: string;
    width: string;
    height: string;
    weight: string;
    cycleLife: string;
    operatingTempMin: string;
    operatingTempMax: string;
    features: string[];
    published: boolean;
    featured: boolean;
    images: Array<{ id?: string; url: string; isPrimary: boolean }>;
  }>({
    sku: "",
    model: "",
    slug: "",
    categoryId: "",
    chemistry: "",
    shortDescription: "",
    description: "",
    shortDescriptionZh: "",
    descriptionZh: "",
    nominalVoltage: "",
    nominalCapacity: "",
    energyDensity: "",
    chargeRate: "",
    dischargeRate: "",
    peakDischargeRate: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    cycleLife: "",
    operatingTempMin: "",
    operatingTempMax: "",
    features: [],
    published: false,
    featured: false,
    images: [],
  });

  const [newFeature, setNewFeature] = useState("");

  // Fetch product data for edit mode
  useEffect(() => {
    if (isNew) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        const data: ProductResponse = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found");
            return;
          }
          throw new Error(data.error || "Failed to fetch product");
        }

        if (!data.data) {
          setError("Product not found");
          return;
        }

        const product = data.data;
        const enTranslation = product.translations?.find(
          (t) => t.locale === "en"
        );
        const zhTranslation = product.translations?.find(
          (t) => t.locale === "zh-CN"
        );

        setFormData({
          sku: product.sku || "",
          model: product.model || "",
          slug: product.slug || "",
          categoryId: product.categoryId || "",
          chemistry: product.chemistry || "",
          shortDescription: enTranslation?.shortDescription || product.shortDescription || "",
          description: enTranslation?.description || product.description || "",
          shortDescriptionZh: zhTranslation?.shortDescription || "",
          descriptionZh: zhTranslation?.description || "",
          nominalVoltage: product.nominalVoltage?.toString() || "",
          nominalCapacity: product.nominalCapacity?.toString() || "",
          energyDensity: product.energyDensity?.toString() || "",
          chargeRate: product.chargeRate?.toString() || "",
          dischargeRate: product.dischargeRate?.toString() || "",
          peakDischargeRate: product.peakDischargeRate?.toString() || "",
          length: product.length?.toString() || "",
          width: product.width?.toString() || "",
          height: product.height?.toString() || "",
          weight: product.weight?.toString() || "",
          cycleLife: product.cycleLife?.toString() || "",
          operatingTempMin: product.operatingTempMin?.toString() || "",
          operatingTempMax: product.operatingTempMax?.toString() || "",
          features: enTranslation?.features || product.features || [],
          published: product.published,
          featured: product.featured,
          images: product.images || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isNew, productId]);

  // Generate slug from model
  const generateSlug = (model: string) => {
    return model
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Prepare data
      const payload = {
        sku: formData.sku,
        model: formData.model,
        slug: formData.slug || generateSlug(formData.model),
        categoryId: formData.categoryId,
        chemistry: formData.chemistry || undefined,
        shortDescription: formData.shortDescription || undefined,
        description: formData.description || undefined,
        nominalVoltage: formData.nominalVoltage
          ? parseFloat(formData.nominalVoltage)
          : undefined,
        nominalCapacity: formData.nominalCapacity
          ? parseFloat(formData.nominalCapacity)
          : undefined,
        energyDensity: formData.energyDensity
          ? parseFloat(formData.energyDensity)
          : undefined,
        chargeRate: formData.chargeRate
          ? parseFloat(formData.chargeRate)
          : undefined,
        dischargeRate: formData.dischargeRate
          ? parseFloat(formData.dischargeRate)
          : undefined,
        peakDischargeRate: formData.peakDischargeRate
          ? parseFloat(formData.peakDischargeRate)
          : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        cycleLife: formData.cycleLife ? parseInt(formData.cycleLife) : undefined,
        operatingTempMin: formData.operatingTempMin
          ? parseInt(formData.operatingTempMin)
          : undefined,
        operatingTempMax: formData.operatingTempMax
          ? parseInt(formData.operatingTempMax)
          : undefined,
        features: formData.features,
        published: formData.published,
        featured: formData.featured,
      };

      const url = isNew
        ? "/api/admin/products"
        : `/api/admin/products/${productId}`;
      const method = isNew ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save product");
      }

      setSaveSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save product"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // Get display name
  const getDisplayName = () => {
    if (isNew) return locale === "zh" ? "添加产品" : "Add Product";
    return formData.model || formData.sku || locale === "zh" ? "编辑产品" : "Edit Product";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
        <span className="ml-3 text-white/60">{t.loading}</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-[#EF4444] mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">{t.error}</h2>
        <p className="text-white/50 mb-4">{error}</p>
        <Link href="/admin/products">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {locale === "zh" ? "返回列表" : "Back to List"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
          <CheckCircle className="w-5 h-5" />
          <span>{t.success}</span>
        </div>
      )}

      {/* Save Error Message */}
      {saveError && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
          <AlertCircle className="w-5 h-5" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {isNew ? t.title : t.titleEdit}
            </h1>
            <p className="text-white/50 text-sm mt-1">{getDisplayName()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && formData.slug && (
            <Link href={`/products/${formData.slug}`} target="_blank">
              <Button variant="ghost">
                <Eye className="w-4 h-4 mr-2" />
                {t.viewProduct}
              </Button>
            </Link>
          )}
          <Link href="/admin/products">
            <Button variant="ghost">{t.cancel}</Button>
          </Link>
          <Button onClick={handleSave} loading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? t.saving : t.save}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">
              {t.basicInfo}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.sku}
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="SKU-BATT-001"
                />
                <Input
                  label={t.model}
                  value={formData.model}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      model: e.target.value,
                      slug: formData.slug || generateSlug(e.target.value),
                    });
                  }}
                  placeholder="CloudChi 360-P"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.slug}
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  hint={t.slugHint + (formData.slug || "slug")}
                />
                <Input
                  label={t.chemistry}
                  value={formData.chemistry}
                  onChange={(e) =>
                    setFormData({ ...formData, chemistry: e.target.value })
                  }
                  placeholder="Li-ion / Solid-state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.description}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                  placeholder="Product description in English..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.descriptionZh}
                </label>
                <textarea
                  value={formData.descriptionZh}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descriptionZh: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                  placeholder="产品描述（中文）..."
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">
              {t.specifications}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t.energyDensity}
                type="number"
                value={formData.energyDensity}
                onChange={(e) =>
                  setFormData({ ...formData, energyDensity: e.target.value })
                }
                placeholder="360"
              />
              <Input
                label={t.voltage}
                type="number"
                value={formData.nominalVoltage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nominalVoltage: e.target.value,
                  })
                }
                placeholder="3.5"
              />
              <Input
                label={t.capacity}
                type="number"
                value={formData.nominalCapacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nominalCapacity: e.target.value,
                  })
                }
                placeholder="25"
              />
              <Input
                label={t.chargeRate}
                type="number"
                value={formData.chargeRate}
                onChange={(e) =>
                  setFormData({ ...formData, chargeRate: e.target.value })
                }
                placeholder="2"
              />
              <Input
                label={t.dischargeRate}
                type="number"
                value={formData.dischargeRate}
                onChange={(e) =>
                  setFormData({ ...formData, dischargeRate: e.target.value })
                }
                placeholder="5"
              />
              <Input
                label={t.peakDischarge}
                type="number"
                value={formData.peakDischargeRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    peakDischargeRate: e.target.value,
                  })
                }
                placeholder="10"
              />
              <Input
                label={t.cycleLife}
                type="number"
                value={formData.cycleLife}
                onChange={(e) =>
                  setFormData({ ...formData, cycleLife: e.target.value })
                }
                placeholder="500"
              />
              <Input
                label={t.weight}
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                placeholder="0.25"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Input
                label="L (mm)"
                type="number"
                value={formData.length}
                onChange={(e) =>
                  setFormData({ ...formData, length: e.target.value })
                }
                placeholder="10.5"
              />
              <Input
                label="W (mm)"
                type="number"
                value={formData.width}
                onChange={(e) =>
                  setFormData({ ...formData, width: e.target.value })
                }
                placeholder="70"
              />
              <Input
                label="H (mm)"
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                placeholder="163"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Min Temp (°C)"
                type="number"
                value={formData.operatingTempMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    operatingTempMin: e.target.value,
                  })
                }
                placeholder="-40"
              />
              <Input
                label="Max Temp (°C)"
                type="number"
                value={formData.operatingTempMax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    operatingTempMax: e.target.value,
                  })
                }
                placeholder="80"
              />
            </div>
          </div>

          {/* Features */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">
              {t.features}
            </h2>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03]"
                >
                  <GripVertical className="w-4 h-4 text-white/30 cursor-move" />
                  <span className="flex-1 text-white">{feature}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-1.5 text-white/40 hover:text-[#EF4444] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addFeature()}
                  placeholder={
                    locale === "en" ? "Add a feature..." : "添加特点..."
                  }
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                />
                <Button variant="outline" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addFeature}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">
              {t.settings}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t.status}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setFormData({ ...formData, published: true })
                    }
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.published
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                  >
                    {t.active}
                  </button>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, published: false })
                    }
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      !formData.published
                        ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                  >
                    {t.draft}
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-[#334155] text-[#3B82F6] focus:ring-[#3B82F6] bg-[#0F172A]"
                  />
                  <span className="text-sm text-white/80">{t.featured}</span>
                </label>
              </div>

              {!isNew && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    {t.deleteProduct}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">
              {t.images}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-white/[0.03]"
                >
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button className="aspect-square rounded-lg border-2 border-dashed border-white/[0.10] hover:border-[#3B82F6]/50 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-[#3B82F6] transition-colors">
                <Upload className="w-6 h-6" />
                <span className="text-xs">{t.uploadImage}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
