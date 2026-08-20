"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Save,
  Trash2,
  Edit,
  Plus,
  GripVertical,
  ImageIcon,
  Check,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Partner category types
interface PartnerCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  logos: PartnerLogo[];
}

interface PartnerLogo {
  id: string;
  name: string;
  nameZh: string;
  imageUrl: string;
  categoryId: string;
}

// Default partner categories
const defaultCategories: PartnerCategory[] = [
  { id: "1", name: "低空飞行", nameEn: "UAV & eVTOL", icon: "🚁", color: "#F59E0B", logos: [] },
  { id: "2", name: "具身智能", nameEn: "Embodied AI", icon: "🤖", color: "#FBBF24", logos: [] },
  { id: "3", name: "深海装备", nameEn: "Underwater", icon: "🌊", color: "#10B981", logos: [] },
  { id: "4", name: "四足机器人", nameEn: "Legged Robots", icon: "🦿", color: "#D97706", logos: [] },
  { id: "5", name: "特种装备", nameEn: "Special Equipment", icon: "⚡", color: "#F97316", logos: [] },
  { id: "6", name: "科研合作", nameEn: "Research", icon: "🔬", color: "#EC4899", logos: [] },
];

// Pre-loaded partner logos (from public/images/partners)
const preloadedLogos = [
  { id: "p1", name: "Partner 1", nameZh: "合作伙伴 1", imageUrl: "/images/partners/图片1.png", categoryId: "1" },
  { id: "p2", name: "Partner 2", nameZh: "合作伙伴 2", imageUrl: "/images/partners/图片2.png", categoryId: "1" },
  { id: "p3", name: "Partner 3", nameZh: "合作伙伴 3", imageUrl: "/images/partners/图片3.png", categoryId: "2" },
  { id: "p4", name: "Partner 4", nameZh: "合作伙伴 4", imageUrl: "/images/partners/图片4.png", categoryId: "2" },
  { id: "p5", name: "Partner 5", nameZh: "合作伙伴 5", imageUrl: "/images/partners/图片5.png", categoryId: "3" },
  { id: "p6", name: "Partner 6", nameZh: "合作伙伴 6", imageUrl: "/images/partners/图片6.png", categoryId: "3" },
  { id: "p7", name: "Partner 7", nameZh: "合作伙伴 7", imageUrl: "/images/partners/图片7.png", categoryId: "4" },
  { id: "p8", name: "Partner 8", nameZh: "合作伙伴 8", imageUrl: "/images/partners/图片8.png", categoryId: "4" },
  { id: "p9", name: "Partner 9", nameZh: "合作伙伴 9", imageUrl: "/images/partners/图片9.png", categoryId: "5" },
  { id: "p10", name: "Partner 10", nameZh: "合作伙伴 10", imageUrl: "/images/partners/图片10.png", categoryId: "5" },
  { id: "p11", name: "Partner 11", nameZh: "合作伙伴 11", imageUrl: "/images/partners/图片11.png", categoryId: "6" },
];

// Partner translations
const translations = {
  en: {
    title: "Partners Management",
    subtitle: "Manage partner logos and categories",
    addPartner: "Add Partner",
    editPartner: "Edit Partner",
    partnerName: "Partner Name",
    partnerNameZh: "Partner Name (Chinese)",
    category: "Category",
    uploadLogo: "Upload Logo",
    selectImage: "Select Image",
    changeImage: "Change Image",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    noPartners: "No partners yet",
    addFirst: "Add your first partner logo",
    availableImages: "Available Images",
    selectExisting: "Select from existing images",
    assigned: "Assigned",
    unassigned: "Unassigned",
    preview: "Preview",
    name: "Name",
    nameZh: "Chinese Name",
    image: "Image",
    actions: "Actions",
  },
  zh: {
    title: "合作伙伴管理",
    subtitle: "管理合作伙伴 Logo 和分类",
    addPartner: "添加合作伙伴",
    editPartner: "编辑合作伙伴",
    partnerName: "合作伙伴名称",
    partnerNameZh: "合作伙伴名称（中文）",
    category: "分类",
    uploadLogo: "上传 Logo",
    selectImage: "选择图片",
    changeImage: "更换图片",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    noPartners: "暂无合作伙伴",
    addFirst: "添加您的第一个合作伙伴 Logo",
    availableImages: "可用图片",
    selectExisting: "从现有图片中选择",
    assigned: "已分配",
    unassigned: "未分配",
    preview: "预览",
    name: "名称",
    nameZh: "中文名",
    image: "图片",
    actions: "操作",
  },
};

export default function PartnersAdminPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const t = translations[isLocale];

  const [categories, setCategories] = useState<PartnerCategory[]>(
    defaultCategories.map((cat) => ({
      ...cat,
      logos: preloadedLogos.filter((logo) => logo.categoryId === cat.id),
    }))
  );
  const [editingPartner, setEditingPartner] = useState<PartnerLogo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unassigned logos
  const assignedLogoIds = categories.flatMap((cat) => cat.logos.map((l) => l.id));
  const unassignedLogos = preloadedLogos.filter((logo) => !assignedLogoIds.includes(logo.id));

  const handleAdd = (categoryId?: string) => {
    const newPartner: PartnerLogo = {
      id: `new-${Date.now()}`,
      name: "",
      nameZh: "",
      imageUrl: "",
      categoryId: categoryId || selectedCategory,
    };
    setEditingPartner(newPartner);
    setIsEditing(true);
    setShowImagePicker(true);
  };

  const handleEdit = (partner: PartnerLogo) => {
    setEditingPartner({ ...partner });
    setSelectedCategory(partner.categoryId);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingPartner) return;

    // Update category assignments
    setCategories((prev) => {
      // Remove from old category
      let updated = prev.map((cat) => ({
        ...cat,
        logos: cat.logos.filter((l) => l.id !== editingPartner.id),
      }));

      // Add to new category (if has image)
      if (editingPartner.imageUrl) {
        updated = updated.map((cat) => {
          if (cat.id === editingPartner.categoryId) {
            const existing = cat.logos.find((l) => l.id === editingPartner.id);
            if (existing) {
              return {
                ...cat,
                logos: cat.logos.map((l) =>
                  l.id === editingPartner.id ? editingPartner : l
                ),
              };
            } else {
              return {
                ...cat,
                logos: [...cat.logos, editingPartner],
              };
            }
          }
          return cat;
        });
      }

      return updated;
    });

    setIsEditing(false);
    setEditingPartner(null);
    setShowImagePicker(false);
  };

  const handleDelete = (partnerId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        logos: cat.logos.filter((l) => l.id !== partnerId),
      }))
    );
  };

  const selectImage = (imageUrl: string) => {
    if (!editingPartner) return;
    setEditingPartner({ ...editingPartner, imageUrl });
    setShowImagePicker(false);
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
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden"
          >
            {/* Category Header */}
            <div
              className="p-4 border-b border-white/[0.06]"
              style={{ borderLeftColor: category.color, borderLeftWidth: 3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-white font-medium">
                      {isLocale === "en" ? category.nameEn : category.name}
                    </h3>
                    <p className="text-xs text-white/40">
                      {category.logos.length} {t.assigned}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleAdd(category.id)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Partner Logos */}
            <div className="p-4">
              {category.logos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {category.logos.map((logo) => (
                    <div
                      key={logo.id}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.06]"
                    >
                      <Image
                        src={logo.imageUrl}
                        alt={isLocale === "en" ? logo.name : logo.nameZh}
                        fill
                        className="object-contain p-2"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(logo)}
                          className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(logo.id)}
                          className="p-1.5 rounded-lg bg-white/10 text-white/60 hover:text-red-400 hover:bg-red-400/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/40">{t.noPartners}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => handleAdd(category.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t.addPartner}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned Images Section */}
      {unassignedLogos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-white/40" />
            {t.unassigned} ({unassignedLogos.length})
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2">
            {unassignedLogos.map((logo) => (
              <div
                key={logo.id}
                onClick={() => {
                  setSelectedCategory("1");
                  handleAdd();
                  setTimeout(() => {
                    setEditingPartner((prev) => prev ? { ...prev, imageUrl: logo.imageUrl } : null);
                  }, 100);
                }}
                className="group cursor-pointer aspect-square rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-accent/50 transition-colors"
              >
                <Image
                  src={logo.imageUrl}
                  alt={logo.name}
                  fill
                  className="object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setIsEditing(false);
              setEditingPartner(null);
              setShowImagePicker(false);
            }}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] border border-white/[0.08] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/[0.06] bg-[#0F172A]">
              <h2 className="text-xl font-semibold text-white">
                {editingPartner.id.startsWith("new-") ? t.addPartner : t.editPartner}
              </h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingPartner(null);
                  setShowImagePicker(false);
                }}
                className="p-2 text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview / Selection */}
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
                  {t.image}
                </label>
                {editingPartner.imageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-white/[0.05]">
                    <Image
                      src={editingPartner.imageUrl}
                      alt="Partner logo"
                      fill
                      className="object-contain p-4"
                    />
                    <button
                      onClick={() => setShowImagePicker(true)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white/60 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowImagePicker(true)}
                    className="w-full aspect-video rounded-lg border-2 border-dashed border-white/[0.10] hover:border-[#3B82F6]/50 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-[#3B82F6] transition-colors"
                  >
                    <Upload className="w-8 h-8" />
                    <span>{t.selectImage}</span>
                  </button>
                )}
              </div>

              {/* Image Picker Modal */}
              {showImagePicker && (
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <h3 className="text-sm font-medium text-white mb-3">{t.availableImages}</h3>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {preloadedLogos.map((logo) => (
                      <button
                        key={logo.id}
                        onClick={() => selectImage(logo.imageUrl)}
                        className="relative aspect-square rounded-lg overflow-hidden bg-white/[0.05] hover:bg-white/[0.1] transition-colors border-2 border-transparent hover:border-accent"
                      >
                        <Image
                          src={logo.imageUrl}
                          alt={logo.name}
                          fill
                          className="object-contain p-1"
                        />
                        {editingPartner.imageUrl === logo.imageUrl && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-2">
                  {t.category}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setEditingPartner({ ...editingPartner, categoryId: cat.id })
                      }
                      className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${
                        editingPartner.categoryId === cat.id
                          ? "bg-accent/20 text-accent border border-accent/30"
                          : "bg-white/[0.03] text-white/60 border border-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">
                        {isLocale === "en" ? cat.nameEn : cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.name}
                  value={editingPartner.name}
                  onChange={(e) =>
                    setEditingPartner({ ...editingPartner, name: e.target.value })
                  }
                  placeholder="Partner name..."
                />
                <Input
                  label={t.nameZh}
                  value={editingPartner.nameZh}
                  onChange={(e) =>
                    setEditingPartner({ ...editingPartner, nameZh: e.target.value })
                  }
                  placeholder="合作伙伴名称..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-white/[0.06] bg-[#0F172A]">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditingPartner(null);
                  setShowImagePicker(false);
                }}
              >
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
