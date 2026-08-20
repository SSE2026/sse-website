"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Reuse translations from new page
const productTranslations = {
  en: {
    title: "Add Product",
    titleEdit: "Edit Product",
    basicInfo: "Basic Information",
    name: "Product Name",
    nameZh: "Product Name (Chinese)",
    series: "Series",
    description: "Description",
    descriptionZh: "Description (Chinese)",
    specifications: "Specifications",
    energyDensity: "Energy Density",
    discharge: "Discharge Rate",
    voltage: "Voltage",
    cycleLife: "Cycle Life",
    operatingTemp: "Operating Temperature",
    images: "Product Images",
    uploadImage: "Upload Image",
    features: "Features",
    addFeature: "Add Feature",
    settings: "Settings",
    status: "Status",
    active: "Active",
    draft: "Draft",
    save: "Save Changes",
    saving: "Saving...",
    cancel: "Cancel",
    slug: "URL Slug",
    slugHint: "URL: /products/",
    selectSeries: "Select Series",
    seriesOptions: {
      "High Power": "High Power (P series)",
      "High Energy": "High Energy (E series)",
      "Ultra High": "Ultra High (X series)",
      "System": "Module & System",
    },
    viewProduct: "View Product",
    deleteProduct: "Delete Product",
  },
  zh: {
    title: "添加产品",
    titleEdit: "编辑产品",
    basicInfo: "基本信息",
    name: "产品名称",
    nameZh: "产品名称（中文）",
    series: "系列",
    description: "描述",
    descriptionZh: "描述（中文）",
    specifications: "技术规格",
    energyDensity: "能量密度",
    discharge: "放电倍率",
    voltage: "电压",
    cycleLife: "循环寿命",
    operatingTemp: "工作温度",
    images: "产品图片",
    uploadImage: "上传图片",
    features: "产品特点",
    addFeature: "添加特点",
    settings: "设置",
    status: "状态",
    active: "已发布",
    draft: "草稿",
    save: "保存更改",
    saving: "保存中...",
    cancel: "取消",
    slug: "URL 标识",
    slugHint: "URL: /products/",
    selectSeries: "选择系列",
    seriesOptions: {
      "High Power": "高功率 (P系列)",
      "High Energy": "高能量 (E系列)",
      "Ultra High": "超高能量 (X系列)",
      "System": "模组与系统",
    },
    viewProduct: "预览产品",
    deleteProduct: "删除产品",
  },
};

// Mock product data
const mockProducts: Record<string, any> = {
  "1": {
    id: "1",
    name: "CloudChi 360-P",
    nameZh: "云驰 360-P",
    slug: "cloudchi-360-p",
    series: "High Power",
    description: "High-power platform for quadruped robots and multi-rotor drones requiring instant power response.",
    descriptionZh: "高功率平台，适用于四足机器人和多旋翼无人机等瞬时功率需求场景。",
    energyDensity: "360 Wh/kg",
    discharge: "2C/5C",
    voltage: "400-800V",
    cycleLife: "500+ cycles",
    operatingTemp: "-20°C to 60°C",
    features: [
      "Ultra-high discharge rate up to 10C",
      "Excellent cycle life over 500 cycles",
      "Wide operating temperature range",
      "Intelligent thermal management",
    ],
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80",
    ],
    status: "active",
  },
  "2": {
    id: "2",
    name: "CloudChi 400-E",
    nameZh: "云驰 400-E",
    slug: "cloudchi-400-e",
    series: "High Energy",
    description: "High-energy platform for fixed-wing drones, AUVs, and inspection robots.",
    descriptionZh: "高能量平台，适用于固定翼/复合翼无人机，长航时潜航器、巡检机器人。",
    energyDensity: "400 Wh/kg",
    discharge: "1C/3C",
    voltage: "400-800V",
    cycleLife: "600+ cycles",
    operatingTemp: "-20°C to 55°C",
    features: [
      "Industry-leading energy density",
      "Long endurance for extended missions",
      "Low self-discharge rate",
      "Fast charging capability",
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    ],
    status: "active",
  },
  "3": {
    id: "3",
    name: "CloudChi 460-X",
    nameZh: "云驰 460-X",
    slug: "cloudchi-460-x",
    series: "Ultra High",
    description: "Ultra-high energy platform for extreme endurance or 10C high-power applications.",
    descriptionZh: "超高能量平台，适用于极限续航或10C高功率输出场景。",
    energyDensity: "460+ Wh/kg",
    discharge: "1C/10C",
    voltage: "400-800V",
    cycleLife: "400+ cycles",
    operatingTemp: "-20°C to 50°C",
    features: [
      "Maximum energy density in the industry",
      "10C peak discharge capability",
      "Optimized for extreme applications",
      "Advanced safety protection",
    ],
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80",
    ],
    status: "draft",
  },
};

interface ProductFormData {
  name: string;
  nameZh: string;
  slug: string;
  series: string;
  description: string;
  descriptionZh: string;
  energyDensity: string;
  discharge: string;
  voltage: string;
  cycleLife: string;
  operatingTemp: string;
  features: string[];
  images: string[];
  status: "active" | "draft";
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useAdmin();
  const t = productTranslations[locale];
  const productId = params.id as string;

  // Load mock data
  const mockProduct = mockProducts[productId] || mockProducts["1"];

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: mockProduct.name,
    nameZh: mockProduct.nameZh,
    slug: mockProduct.slug,
    series: mockProduct.series,
    description: mockProduct.description,
    descriptionZh: mockProduct.descriptionZh,
    energyDensity: mockProduct.energyDensity,
    discharge: mockProduct.discharge,
    voltage: mockProduct.voltage,
    cycleLife: mockProduct.cycleLife,
    operatingTemp: mockProduct.operatingTemp,
    features: [...mockProduct.features],
    images: [...mockProduct.images],
    status: mockProduct.status,
  });
  const [newFeature, setNewFeature] = useState("");

  const seriesOptions = [
    { value: "High Power", label: t.seriesOptions["High Power"] },
    { value: "High Energy", label: t.seriesOptions["High Energy"] },
    { value: "Ultra High", label: t.seriesOptions["Ultra High"] },
    { value: "System", label: t.seriesOptions["System"] },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // API call would go here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push("/admin/products");
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
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
              {t.titleEdit}
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {formData.name} {formData.nameZh && `/ ${formData.nameZh}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/products/${formData.slug}`} target="_blank">
            <Button variant="ghost">
              <Eye className="w-4 h-4 mr-2" />
              {t.viewProduct}
            </Button>
          </Link>
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
            <h2 className="text-lg font-semibold text-white mb-4">{t.basicInfo}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label={t.nameZh}
                  value={formData.nameZh}
                  onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                    {t.series} <span className="text-[#EF4444]">*</span>
                  </label>
                  <select
                    value={formData.series}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    className="w-full h-10 px-4 rounded-lg bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="">{t.selectSeries}</option>
                    {seriesOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label={t.slug}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  hint={t.slugHint + (formData.slug || "slug")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.description}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.descriptionZh}
                </label>
                <textarea
                  value={formData.descriptionZh}
                  onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">{t.specifications}</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t.energyDensity}
                value={formData.energyDensity}
                onChange={(e) => setFormData({ ...formData, energyDensity: e.target.value })}
              />
              <Input
                label={t.discharge}
                value={formData.discharge}
                onChange={(e) => setFormData({ ...formData, discharge: e.target.value })}
              />
              <Input
                label={t.voltage}
                value={formData.voltage}
                onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
              />
              <Input
                label={t.cycleLife}
                value={formData.cycleLife}
                onChange={(e) => setFormData({ ...formData, cycleLife: e.target.value })}
              />
              <Input
                label={t.operatingTemp}
                value={formData.operatingTemp}
                onChange={(e) => setFormData({ ...formData, operatingTemp: e.target.value })}
              />
            </div>
          </div>

          {/* Features */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">{t.features}</h2>
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
                  placeholder={locale === "en" ? "Add a feature..." : "添加特点..."}
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
            <h2 className="text-lg font-semibold text-white mb-4">{t.settings}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">{t.status}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, status: "active" })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.status === "active"
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                  >
                    {t.active}
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, status: "draft" })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.status === "draft"
                        ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                  >
                    {t.draft}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  {t.deleteProduct}
                </button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">{t.images}</h2>
            <div className="grid grid-cols-2 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white/[0.03]">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setFormData({
                      ...formData,
                      images: formData.images.filter((_, i) => i !== index)
                    })}
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
