"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  GripVertical,
  Upload,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock banner data
const mockBanners: Banner[] = [
  {
    id: "1",
    title: "CloudChi 360-P Series",
    titleZh: "云驰 360-P 系列",
    subtitle: "High power solid-state battery for drones and robots",
    subtitleZh: "高功率固态电池，适用于无人机和机器人",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
    link: "/products/cloudchi-360-p",
    order: 1,
    status: "active",
    devices: ["desktop", "mobile"],
  },
  {
    id: "2",
    title: "Technology Breakthrough",
    titleZh: "技术突破",
    subtitle: "570+ Wh/kg energy density achieved",
    subtitleZh: "成功实现 570+ Wh/kg 能量密度",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    link: "/technology",
    order: 2,
    status: "active",
    devices: ["desktop", "mobile"],
  },
  {
    id: "3",
    title: "Contact Us",
    titleZh: "联系我们",
    subtitle: "Partner with us for next-generation battery solutions",
    subtitleZh: "与我们合作，开发下一代电池解决方案",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80",
    link: "/contact",
    order: 3,
    status: "draft",
    devices: ["desktop"],
  },
];

// Banner translations
const bannerTranslations = {
  en: {
    title: "Banner Management",
    subtitle: "Manage homepage carousel slides",
    addBanner: "Add Banner",
    slide: "Slide",
    titleField: "Title",
    titleFieldZh: "Title (Chinese)",
    subtitleField: "Subtitle",
    subtitleFieldZh: "Subtitle (Chinese)",
    image: "Background Image",
    link: "Link URL",
    devices: "Display Devices",
    desktop: "Desktop",
    mobile: "Mobile",
    status: "Status",
    active: "Active",
    draft: "Draft",
    actions: "Actions",
    moveUp: "Move Up",
    moveDown: "Move Down",
    edit: "Edit",
    delete: "Delete",
    preview: "Preview",
    save: "Save",
    cancel: "Cancel",
    dragToReorder: "Drag to reorder slides",
    uploadImage: "Upload Image",
    noBanners: "No banners yet",
    addFirst: "Add your first banner",
  },
  zh: {
    title: "横幅管理",
    subtitle: "管理首页轮播图",
    addBanner: "添加横幅",
    slide: "幻灯片",
    titleField: "标题",
    titleFieldZh: "标题（中文）",
    subtitleField: "副标题",
    subtitleFieldZh: "副标题（中文）",
    image: "背景图片",
    link: "链接地址",
    devices: "显示设备",
    desktop: "桌面端",
    mobile: "移动端",
    status: "状态",
    active: "已启用",
    draft: "草稿",
    actions: "操作",
    moveUp: "上移",
    moveDown: "下移",
    edit: "编辑",
    delete: "删除",
    preview: "预览",
    save: "保存",
    cancel: "取消",
    dragToReorder: "拖动以重新排序",
    uploadImage: "上传图片",
    noBanners: "暂无横幅",
    addFirst: "添加您的第一个横幅",
  },
};

interface Banner {
  id: string;
  title: string;
  titleZh: string;
  subtitle: string;
  subtitleZh: string;
  image: string;
  link: string;
  order: number;
  status: "active" | "draft";
  devices: ("desktop" | "mobile")[];
}

export default function BannersAdminPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const t = bannerTranslations[isLocale];

  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (banner: Banner) => {
    setEditingBanner({ ...banner });
    setIsEditing(true);
  };

  const handleAdd = () => {
    const newBanner: Banner = {
      id: `new-${Date.now()}`,
      title: "",
      titleZh: "",
      subtitle: "",
      subtitleZh: "",
      image: "",
      link: "",
      order: banners.length + 1,
      status: "draft",
      devices: ["desktop", "mobile"],
    };
    setEditingBanner(newBanner);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingBanner) return;

    if (banners.find((b) => b.id === editingBanner.id)) {
      setBanners(banners.map((b) => (b.id === editingBanner.id ? editingBanner : b)));
    } else {
      setBanners([...banners, editingBanner]);
    }
    setIsEditing(false);
    setEditingBanner(null);
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
    newBanners.forEach((b, i) => (b.order = i + 1));
    setBanners(newBanners);
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    newBanners.forEach((b, i) => (b.order = i + 1));
    setBanners(newBanners);
  };

  const toggleDevice = (device: "desktop" | "mobile") => {
    if (!editingBanner) return;
    const devices = editingBanner.devices.includes(device)
      ? editingBanner.devices.filter((d) => d !== device)
      : [...editingBanner.devices, device];
    setEditingBanner({ ...editingBanner, devices });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t.title}
          </h1>
          <p className="text-white/50 mt-1">
            {t.subtitle}
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {t.addBanner}
        </Button>
      </div>

      {/* Banners Grid */}
      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden"
          >
            <div className="flex items-center gap-4">
              {/* Drag Handle */}
              <div className="text-white/30 cursor-move">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Order Number */}
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.05] text-white/60 text-sm font-medium">
                {banner.order}
              </div>

              {/* Thumbnail */}
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                {banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-medium truncate">
                    {isLocale === "en" ? banner.title : banner.titleZh}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                      banner.status === "active"
                        ? "bg-[#10B981]/20 text-[#10B981]"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {banner.status === "active" ? t.active : t.draft}
                  </span>
                </div>
                <p className="text-sm text-white/40 truncate">
                  {isLocale === "en" ? banner.subtitle : banner.subtitleZh}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-white/30">
                    {banner.devices.includes("desktop") && <Monitor className="w-3 h-3" />}
                    {banner.devices.includes("mobile") && <Smartphone className="w-3 h-3" />}
                  </div>
                  <span className="text-xs text-white/30">{banner.link}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === banners.length - 1}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-white/40 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-16 rounded-xl bg-white/[0.03] border border-white/[0.06] border-dashed">
            <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 mb-2">{t.noBanners}</p>
            <p className="text-sm text-white/30 mb-4">{t.addFirst}</p>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              {t.addBanner}
            </Button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsEditing(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] border border-white/[0.08] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/[0.06] bg-[#0F172A]">
              <h2 className="text-xl font-semibold text-white">
                {t.edit} {t.slide} #{editingBanner.order}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.image}</label>
                {editingBanner.image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-white/[0.05]">
                    <Image
                      src={editingBanner.image}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setEditingBanner({ ...editingBanner, image: "" })}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button className="w-full aspect-video rounded-lg border-2 border-dashed border-white/[0.10] hover:border-[#3B82F6]/50 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-[#3B82F6] transition-colors">
                    <Upload className="w-8 h-8" />
                    <span>{t.uploadImage}</span>
                  </button>
                )}
              </div>

              {/* Title */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.titleField}
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="Banner title..."
                />
                <Input
                  label={t.titleFieldZh}
                  value={editingBanner.titleZh}
                  onChange={(e) => setEditingBanner({ ...editingBanner, titleZh: e.target.value })}
                  placeholder="横幅标题..."
                />
              </div>

              {/* Subtitle */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.subtitleField}
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="Banner subtitle..."
                />
                <Input
                  label={t.subtitleFieldZh}
                  value={editingBanner.subtitleZh}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitleZh: e.target.value })}
                  placeholder="副标题..."
                />
              </div>

              {/* Link */}
              <Input
                label={t.link}
                value={editingBanner.link}
                onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                placeholder="/products/cloudchi-360-p"
              />

              {/* Devices */}
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.devices}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleDevice("desktop")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                      editingBanner.devices.includes("desktop")
                        ? "bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10]"
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    {t.desktop}
                  </button>
                  <button
                    onClick={() => toggleDevice("mobile")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                      editingBanner.devices.includes("mobile")
                        ? "bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10]"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    {t.mobile}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.status}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingBanner({ ...editingBanner, status: "active" })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      editingBanner.status === "active"
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10]"
                    }`}
                  >
                    {t.active}
                  </button>
                  <button
                    onClick={() => setEditingBanner({ ...editingBanner, status: "draft" })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      editingBanner.status === "draft"
                        ? "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10]"
                    }`}
                  >
                    {t.draft}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-white/[0.06] bg-[#0F172A]">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
