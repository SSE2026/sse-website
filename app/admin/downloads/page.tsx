"use client";

import { useState } from "react";
import {
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  File,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/app/admin/layout";

// 模拟下载资源数据
const downloads = [
  {
    id: "1",
    name: "CloudChi 360-P Datasheet",
    nameZh: "云驰 360-P 技术规格书",
    category: "Datasheet",
    categoryZh: "规格书",
    fileType: "pdf",
    fileSize: "2.4 MB",
    downloads: 1250,
    status: "active",
  },
  {
    id: "2",
    name: "Product Catalog 2024",
    nameZh: "产品目录 2024",
    category: "Catalog",
    categoryZh: "目录",
    fileType: "pdf",
    fileSize: "15.8 MB",
    downloads: 890,
    status: "active",
  },
  {
    id: "3",
    name: "UN38.3 Certification",
    nameZh: "UN38.3 认证证书",
    category: "Certificate",
    categoryZh: "证书",
    fileType: "pdf",
    fileSize: "1.2 MB",
    downloads: 456,
    status: "active",
  },
  {
    id: "4",
    name: "CE Declaration",
    nameZh: "CE 符合性声明",
    category: "Certificate",
    categoryZh: "证书",
    fileType: "pdf",
    fileSize: "0.8 MB",
    downloads: 234,
    status: "active",
  },
  {
    id: "5",
    name: "RoHS Report",
    nameZh: "RoHS 检测报告",
    category: "Report",
    categoryZh: "报告",
    fileType: "pdf",
    fileSize: "1.5 MB",
    downloads: 123,
    status: "draft",
  },
];

export default function DownloadsAdminPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDownloads = downloads.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameZh.includes(searchQuery)
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Certificate":
      case "证书":
        return Shield;
      case "Datasheet":
      case "规格书":
        return FileText;
      case "Catalog":
      case "目录":
        return File;
      default:
        return File;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Certificate":
      case "证书":
        return "#10B981";
      case "Datasheet":
      case "规格书":
        return "#3B82F6";
      case "Catalog":
      case "目录":
        return "#8B5CF6";
      default:
        return "#F59E0B";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {isLocale === "en" ? "Downloads Management" : "下载管理"}
          </h1>
          <p className="text-white/50 mt-1">
            {isLocale === "en"
              ? "Manage datasheets, certificates, and resources"
              : "管理规格书、证书和资源下载"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {isLocale === "en" ? "Add Resource" : "添加资源"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={isLocale === "en" ? "Search resources..." : "搜索资源..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          {isLocale === "en" ? "Filter" : "筛选"}
        </Button>
      </div>

      {/* Downloads Table */}
      <div className="rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Resource" : "资源"}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Category" : "分类"}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "File" : "文件"}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {isLocale === "en" ? "Downloads" : "下载次数"}
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
              {filteredDownloads.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category);
                const color = getCategoryColor(item.category);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <CategoryIcon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-sm text-white/40">{item.nameZh}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${color}15`,
                          color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {isLocale === "en" ? item.category : item.categoryZh}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/50">
                        <File className="w-4 h-4" />
                        <span className="text-sm font-mono">
                          {item.fileType.toUpperCase()} · {item.fileSize}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-white/70 font-mono">{item.downloads}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === "active"
                            ? "bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20"
                            : "bg-[#F59E0B]/10 text-[#FBBF24] border border-[#F59E0B]/20"
                        }`}
                      >
                        <BadgeCheck className="w-3 h-3" />
                        {item.status === "active"
                          ? isLocale === "en"
                            ? "Active"
                            : "已发布"
                          : isLocale === "en"
                          ? "Hidden"
                          : "隐藏"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-white/40 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/40 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredDownloads.length === 0 && (
        <div className="text-center py-12">
          <Download className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">
            {isLocale === "en" ? "No resources found" : "未找到资源"}
          </p>
        </div>
      )}
    </div>
  );
}
