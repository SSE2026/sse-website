"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    mobileImage: "Mobile Image (Optional)",
    link: "Link URL",
    ctaText: "CTA Button Text",
    ctaTextZh: "CTA Button Text (Chinese)",
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
    uploadImage: "Upload Image",
    noBanners: "No banners yet",
    addFirst: "Add your first banner",
    loading: "Loading banners...",
    error: "Failed to load banners",
    retry: "Retry",
    deleteConfirm: "Are you sure you want to delete this banner?",
    deleteSuccess: "Banner deleted successfully",
    saveSuccess: "Banner saved successfully",
    saveError: "Failed to save banner",
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
    mobileImage: "移动端图片（可选）",
    link: "链接地址",
    ctaText: "按钮文字",
    ctaTextZh: "按钮文字（中文）",
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
    uploadImage: "上传图片",
    noBanners: "暂无横幅",
    addFirst: "添加您的第一个横幅",
    loading: "加载横幅中...",
    error: "加载横幅失败",
    retry: "重试",
    deleteConfirm: "确定要删除此横幅吗？",
    deleteSuccess: "横幅删除成功",
    saveSuccess: "横幅保存成功",
    saveError: "保存横幅失败",
  },
};

// Banner interface matching API response
interface Banner {
  id: string;
  title?: string;
  titleZh?: string;
  subtitle?: string;
  subtitleZh?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  ctaText?: string;
  ctaTextZh?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

// Form data for editing
interface BannerFormData {
  title: string;
  titleZh: string;
  subtitle: string;
  subtitleZh: string;
  image: string;
  mobileImage: string;
  link: string;
  ctaText: string;
  ctaTextZh: string;
  isActive: boolean;
  sortOrder: number;
}

export default function BannersAdminPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const t = bannerTranslations[isLocale];

  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<BannerFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch banners from API
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/banners");
      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      setBanners(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Convert Banner to form data
  const bannerToFormData = (banner?: Banner): BannerFormData => ({
    title: banner?.title || "",
    titleZh: banner?.titleZh || "",
    subtitle: banner?.subtitle || "",
    subtitleZh: banner?.subtitleZh || "",
    image: banner?.image || "",
    mobileImage: banner?.mobileImage || "",
    link: banner?.link || "",
    ctaText: banner?.ctaText || "",
    ctaTextZh: banner?.ctaTextZh || "",
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder ?? banners.length,
  });

  const handleEdit = (banner: Banner) => {
    setEditingBanner(bannerToFormData(banner));
    setEditingId(banner.id);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingBanner(bannerToFormData());
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingBanner) return;

    setSaving(true);
    try {
      const payload = {
        title: editingBanner.title || undefined,
        titleZh: editingBanner.titleZh || undefined,
        subtitle: editingBanner.subtitle || undefined,
        subtitleZh: editingBanner.subtitleZh || undefined,
        image: editingBanner.image,
        mobileImage: editingBanner.mobileImage || undefined,
        link: editingBanner.link || undefined,
        ctaText: editingBanner.ctaText || undefined,
        ctaTextZh: editingBanner.ctaTextZh || undefined,
        isActive: editingBanner.isActive,
        sortOrder: editingBanner.sortOrder,
      };

      let response: Response;

      if (editingId) {
        // Update existing banner
        response = await fetch(`/api/admin/banners/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new banner
        response = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save banner");
      }

      showToast(t.saveSuccess, 'success');
      setIsEditing(false);
      setEditingBanner(null);
      setEditingId(null);
      fetchBanners();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.saveError, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      showToast(t.deleteSuccess, 'success');
      fetchBanners();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete banner", 'error');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}/status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      fetchBanners();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update status", 'error');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    const temp = newBanners[index].sortOrder;
    newBanners[index].sortOrder = newBanners[index - 1].sortOrder;
    newBanners[index - 1].sortOrder = temp;
    [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
    setBanners(newBanners);

    // Save new order to API
    try {
      await fetch("/api/admin/banners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newBanners.map((b) => b.id) }),
      });
    } catch (err) {
      showToast("Failed to reorder banners", 'error');
      fetchBanners(); // Revert on error
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    const temp = newBanners[index].sortOrder;
    newBanners[index].sortOrder = newBanners[index + 1].sortOrder;
    newBanners[index + 1].sortOrder = temp;
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    setBanners(newBanners);

    // Save new order to API
    try {
      await fetch("/api/admin/banners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newBanners.map((b) => b.id) }),
      });
    } catch (err) {
      showToast("Failed to reorder banners", 'error');
      fetchBanners(); // Revert on error
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
        <span className="ml-3 text-white/50">{t.loading}</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-white/70 mb-4">{t.error}</p>
        <Button onClick={fetchBanners}>{t.retry}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success'
              ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {toast.message}
        </div>
      )}

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
                {index + 1}
              </div>

              {/* Thumbnail */}
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                {banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title || "Banner"}
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
                    {isLocale === "en" ? banner.title || "Untitled" : banner.titleZh || "无标题"}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 cursor-pointer ${
                      banner.isActive
                        ? "bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30"
                        : "bg-white/10 text-white/50 hover:bg-white/15"
                    }`}
                    onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                    title="Click to toggle status"
                  >
                    {banner.isActive ? t.active : t.draft}
                  </span>
                </div>
                <p className="text-sm text-white/40 truncate">
                  {isLocale === "en" ? banner.subtitle || "No subtitle" : banner.subtitleZh || "无副标题"}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-white/30">{banner.link || "/"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t.moveUp}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === banners.length - 1}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t.moveDown}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                  title={t.edit}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-white/40 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                  title={t.delete}
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
            onClick={() => !saving && setIsEditing(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] border border-white/[0.08] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/[0.06] bg-[#0F172A]">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? `${t.edit} ${t.slide}` : t.addBanner}
              </h2>
              <button
                onClick={() => !saving && setIsEditing(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                disabled={saving}
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
                  <div className="flex flex-col items-center justify-center gap-2 p-8 rounded-lg border-2 border-dashed border-white/[0.10] text-white/40">
                    <Upload className="w-8 h-8" />
                    <span>{t.uploadImage}</span>
                    <input
                      type="text"
                      value={editingBanner.image}
                      onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                      placeholder="Enter image URL..."
                      className="mt-2 w-full max-w-sm px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.10] text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#3B82F6]/50"
                    />
                  </div>
                )}
              </div>

              {/* Image URL Input */}
              <div>
                <Input
                  label={`${t.image} URL`}
                  value={editingBanner.image}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Mobile Image URL */}
              <div>
                <Input
                  label={t.mobileImage}
                  value={editingBanner.mobileImage}
                  onChange={(e) => setEditingBanner({ ...editingBanner, mobileImage: e.target.value })}
                  placeholder="https://images.unsplash.com/... (optional)"
                />
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

              {/* CTA Text */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.ctaText}
                  value={editingBanner.ctaText}
                  onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                  placeholder="Customize Now"
                />
                <Input
                  label={t.ctaTextZh}
                  value={editingBanner.ctaTextZh}
                  onChange={(e) => setEditingBanner({ ...editingBanner, ctaTextZh: e.target.value })}
                  placeholder="即刻定制"
                />
              </div>

              {/* Link */}
              <Input
                label={t.link}
                value={editingBanner.link}
                onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                placeholder="/products/cloudchi-360-p"
              />

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.status}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingBanner({ ...editingBanner, isActive: true })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      editingBanner.isActive
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10]"
                    }`}
                  >
                    {t.active}
                  </button>
                  <button
                    onClick={() => setEditingBanner({ ...editingBanner, isActive: false })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      !editingBanner.isActive
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
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={saving}>
                {t.cancel}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
