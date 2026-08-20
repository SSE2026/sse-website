"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Cpu,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/app/admin/layout";

// 模拟产品数据
const products = [
  {
    id: "1",
    name: "CloudChi 360-P",
    nameZh: "云驰 360-P",
    series: "High Power",
    seriesZh: "高功率",
    energyDensity: "360 Wh/kg",
    discharge: "5C",
    status: "active",
    statusZh: "已发布",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200&q=80",
  },
  {
    id: "2",
    name: "CloudChi 400-E",
    nameZh: "云驰 400-E",
    series: "High Energy",
    seriesZh: "高能量",
    energyDensity: "400 Wh/kg",
    discharge: "3C",
    status: "active",
    statusZh: "已发布",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  },
  {
    id: "3",
    name: "CloudChi 460-X",
    nameZh: "云驰 460-X",
    series: "Ultra High",
    seriesZh: "超高能量",
    energyDensity: "460+ Wh/kg",
    discharge: "10C",
    status: "draft",
    statusZh: "草稿",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&q=80",
  },
  {
    id: "4",
    name: "Module & System",
    nameZh: "模组与系统",
    series: "System",
    seriesZh: "系统",
    energyDensity: "400-800V",
    discharge: "Custom",
    status: "active",
    statusZh: "已发布",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=200&q=80",
  },
];

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
    showing: "Showing {count} of {total} products",
    showingZh: "显示 {count} / {total} 个产品",
    previous: "Previous",
    next: "Next",
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
    showing: "显示 {count} / {total} 个产品",
    showingZh: "显示 {count} / {total} 个产品",
    previous: "上一页",
    next: "下一页",
  },
};

export default function ProductsAdminPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const t = productsTranslations[isLocale];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameZh.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {isLocale === "en" ? t.title : t.titleZh}
          </h1>
          <p className="text-white/50 mt-1">
            {isLocale === "en" ? t.subtitle : t.subtitleZh}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          {t.filter}
        </Button>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Product" : "产品"}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Series" : "系列"}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Energy Density" : "能量密度"}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Discharge" : "放电"}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Status" : "状态"}
                </th>
                <th className="text-right p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Actions" : "操作"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.05]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-sm text-white/40">{product.nameZh}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/20">
                      <Zap className="w-3 h-3" />
                      {isLocale === "en" ? product.series : product.seriesZh}
                    </span>
                  </td>
                  <td className="p-4 text-white/70 font-mono">{product.energyDensity}</td>
                  <td className="p-4 text-white/70 font-mono">{product.discharge}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.status === "active"
                          ? "bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20"
                          : "bg-[#F59E0B]/10 text-[#FBBF24] border border-[#F59E0B]/20"
                      }`}
                    >
                      {isLocale === "en" ? product.status : product.statusZh}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-2 text-white/40 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-white/40 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">
          {isLocale === "en"
            ? `Showing ${filteredProducts.length} of ${products.length} products`
            : `显示 ${filteredProducts.length} / ${products.length} 个产品`}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            {isLocale === "en" ? "Previous" : "上一页"}
          </Button>
          <Button variant="outline" size="sm">
            {isLocale === "en" ? "Next" : "下一页"}
          </Button>
        </div>
      </div>
    </div>
  );
}
