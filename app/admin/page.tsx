"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  FileText,
  Download,
  Users,
  Eye,
  Globe,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useAdmin } from "./layout";
import { Button } from "@/components/ui/button";

// 模拟统计数据
const stats = [
  { label: "Products", labelZh: "产品", value: "4", icon: Package, color: "#3B82F6" },
  { label: "News Articles", labelZh: "新闻", value: "12", icon: FileText, color: "#10B981" },
  { label: "Downloads", labelZh: "下载资源", value: "28", icon: Download, color: "#8B5CF6" },
  { label: "Page Views", labelZh: "页面浏览", value: "5.2K", icon: Eye, color: "#F59E0B" },
];

// 模拟最近活动
const recentActivities = [
  { id: 1, action: "Updated", actionZh: "更新了", target: "CloudChi 360-P Product", time: "2 hours ago", user: "Admin" },
  { id: 2, action: "Published", actionZh: "发布了", target: "New Technology Article", time: "5 hours ago", user: "Admin" },
  { id: 3, action: "Added", actionZh: "添加了", target: "Product Datasheet", time: "1 day ago", user: "Admin" },
  { id: 4, action: "New User", actionZh: "新用户", target: "contact@company.com", time: "1 day ago", user: "System" },
];

// 模拟产品数据
const products = [
  { id: "1", name: "CloudChi 360-P", category: "High Power", categoryZh: "高功率", views: 1250 },
  { id: "2", name: "CloudChi 400-E", category: "High Energy", categoryZh: "高能量", views: 980 },
  { id: "3", name: "CloudChi 460-X", category: "Ultra High", categoryZh: "超高能量", views: 856 },
];

// Dashboard translations
const dashboardTranslations = {
  en: {
    title: "Dashboard",
    subtitle: "System overview and quick actions",
    viewAll: "View All",
    products: "Products",
    quickActions: "Quick Actions",
    addProduct: "Add Product",
    addNews: "Add News",
    editBanner: "Edit Banner",
    downloads: "Downloads",
    recentActivity: "Recent Activity",
  },
  zh: {
    title: "仪表盘",
    subtitle: "系统概览和快速操作",
    viewAll: "查看全部",
    products: "产品管理",
    quickActions: "快捷操作",
    addProduct: "添加产品",
    addNews: "添加新闻",
    editBanner: "编辑横幅",
    downloads: "下载管理",
    recentActivity: "最近活动",
  },
};

export default function AdminDashboard() {
  const { locale, t } = useAdmin();
  const isLocale = locale;
  const tD = (key: string) => {
    return dashboardTranslations[isLocale][key as keyof typeof dashboardTranslations.en];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {tD("title")}
          </h1>
          <p className="text-white/50 mt-1">
            {tD("subtitle")}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-white/30" />
            </div>
            <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              {stat.value}
            </div>
            <div className="text-sm text-white/50">
              {isLocale === "en" ? stat.label : stat.labelZh}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Products */}
        <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              <Package className="w-5 h-5 text-[#3B82F6]" />
              {tD("products")}
            </h2>
            <Link
              href="/admin/products"
              className="text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
            >
              {tD("viewAll")}
            </Link>
          </div>
          <div className="space-y-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{product.name}</div>
                    <div className="text-xs text-white/40">{isLocale === "en" ? product.category : product.categoryZh}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-white/40">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{product.views}</span>
                  </div>
                  <Edit className="w-4 h-4 text-white/30 hover:text-[#3B82F6] cursor-pointer" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              <TrendingUp className="w-5 h-5 text-[#10B981]" />
              {tD("quickActions")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/products/new"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20 transition-colors"
            >
              <Plus className="w-8 h-8 text-[#3B82F6] mb-2" />
              <span className="text-sm text-white">{tD("addProduct")}</span>
            </Link>
            <Link
              href="/admin/news/new"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 hover:bg-[#10B981]/20 transition-colors"
            >
              <FileText className="w-8 h-8 text-[#10B981] mb-2" />
              <span className="text-sm text-white">{tD("addNews")}</span>
            </Link>
            <Link
              href="/admin/banners"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 transition-colors"
            >
              <Globe className="w-8 h-8 text-[#8B5CF6] mb-2" />
              <span className="text-sm text-white">{tD("editBanner")}</span>
            </Link>
            <Link
              href="/admin/downloads"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 hover:bg-[#F59E0B]/20 transition-colors"
            >
              <Download className="w-8 h-8 text-[#F59E0B] mb-2" />
              <span className="text-sm text-white">{tD("downloads")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <TrendingUp className="w-5 h-5 text-[#06B6D4]" />
          {tD("recentActivity")}
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03]"
            >
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <div className="flex-1">
                <span className="text-white">{isLocale === "en" ? activity.action : activity.actionZh}</span>
                <span className="text-white/50"> · </span>
                <span className="text-[#3B82F6]">{activity.target}</span>
              </div>
              <div className="text-sm text-white/40">{activity.time}</div>
              <div className="text-sm text-white/40">by {activity.user}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
