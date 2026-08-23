"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Video,
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
  Loader2,
  AlertCircle,
  Play,
  Check,
  FileIcon,
  RefreshCw,
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
    mediaType: "Media Type",
    image: "Background Image",
    video: "Video",
    videoUrl: "Video URL",
    posterUrl: "Video Poster (Optional)",
    mobileImage: "Mobile Image",
    mobileVideo: "Mobile Video",
    mobileVideoUrl: "Mobile Video URL",
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
    uploadVideo: "Upload Video",
    uploadPoster: "Upload Poster",
    uploadMobileVideo: "Upload Mobile Video",
    noBanners: "No banners yet",
    addFirst: "Add your first banner",
    loading: "Loading banners...",
    error: "Failed to load banners",
    retry: "Retry",
    deleteConfirm: "Are you sure you want to delete this banner?",
    deleteSuccess: "Banner deleted successfully",
    saveSuccess: "Banner saved successfully",
    saveError: "Failed to save banner",
    imageType: "Image",
    videoType: "Video",
    titleField: "Title (English)",
    titleFieldZh: "Title (Chinese)",
    subtitleField: "Subtitle (English)",
    subtitleFieldZh: "Subtitle (Chinese)",
    uploading: "Uploading...",
    uploadSuccess: "Upload successful",
    uploadFailed: "Upload failed",
    uploadProgress: "Uploading:",
    replace: "Replace",
    dragOrClick: "Drag & drop or click to upload",
    fileSize: "Size",
    supportedFormats: "Supported formats",
  },
  zh: {
    title: "横幅管理",
    subtitle: "管理首页轮播图",
    addBanner: "添加横幅",
    slide: "幻灯片",
    mediaType: "媒体类型",
    image: "背景图片",
    video: "视频",
    videoUrl: "视频链接",
    posterUrl: "视频封面（可选）",
    mobileImage: "移动端图片",
    mobileVideo: "移动端视频",
    mobileVideoUrl: "移动端视频链接",
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
    uploadVideo: "上传视频",
    uploadPoster: "上传封面",
    uploadMobileVideo: "上传移动端视频",
    noBanners: "暂无横幅",
    addFirst: "添加您的第一个横幅",
    loading: "加载横幅中...",
    error: "加载横幅失败",
    retry: "重试",
    deleteConfirm: "确定要删除此横幅吗？",
    deleteSuccess: "横幅删除成功",
    saveSuccess: "横幅保存成功",
    saveError: "保存横幅失败",
    imageType: "图片",
    videoType: "视频",
    titleField: "标题（英文）",
    titleFieldZh: "标题（中文）",
    subtitleField: "副标题（英文）",
    subtitleFieldZh: "副标题（中文）",
    uploading: "上传中...",
    uploadSuccess: "上传成功",
    uploadFailed: "上传失败",
    uploadProgress: "上传进度:",
    replace: "替换",
    dragOrClick: "拖拽或点击上传",
    fileSize: "大小",
    supportedFormats: "支持格式",
  },
};

// Banner interface matching API response
interface Banner {
  id: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  title?: string;
  titleZh?: string;
  subtitle?: string;
  subtitleZh?: string;
  image?: string;
  mobileImage?: string;
  videoUrl?: string;
  posterUrl?: string;
  mobileVideoUrl?: string;
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
  mediaType: 'IMAGE' | 'VIDEO';
  title: string;
  titleZh: string;
  subtitle: string;
  subtitleZh: string;
  image: string;
  mobileImage: string;
  videoUrl: string;
  posterUrl: string;
  mobileVideoUrl: string;
  link: string;
  ctaText: string;
  ctaTextZh: string;
  isActive: boolean;
  sortOrder: number;
}

// Upload state
interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

// Upload button component
function UploadButton({
  label,
  accept,
  onUpload,
  uploading,
  disabled,
  isLocale,
}: {
  label: string;
  accept: string;
  onUpload: (file: File) => void;
  uploading: boolean;
  disabled?: boolean;
  isLocale: "en" | "zh";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={disabled || uploading}
        className="w-full border-dashed"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isLocale === 'en' ? 'Uploading...' : '上传中...'}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}

// Media preview component
function MediaPreview({
  type,
  src,
  poster,
  onRemove,
}: {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-white/[0.05]">
      {type === 'video' ? (
        <video
          src={src}
          poster={poster}
          controls
          className="w-full h-full object-contain"
        />
      ) : (
        <Image
          src={src}
          alt="Preview"
          fill
          className="object-cover"
        />
      )}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white/60 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Upload zone component
function UploadZone({
  type,
  onUpload,
  uploading,
  progress,
  error,
  success,
  t,
}: {
  type: 'image' | 'video';
  onUpload: (file: File) => void;
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  t: typeof bannerTranslations.zh;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const accept = type === 'image' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm';
  const formats = type === 'image' ? 'JPG, PNG, WebP' : 'MP4, WebM';
  const icon = type === 'image' ? <ImageIcon className="w-8 h-8" /> : <Video className="w-8 h-8" />;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={!uploading ? handleClick : undefined}
      className={`
        relative aspect-video rounded-lg border-2 border-dashed cursor-pointer transition-colors
        ${dragOver
          ? 'border-[#3B82F6] bg-[#3B82F6]/10'
          : 'border-white/[0.10] hover:border-white/[0.20]'
        }
        ${uploading ? 'cursor-not-allowed opacity-70' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
        {icon}
        <span className="text-sm">{t.dragOrClick}</span>
        <span className="text-xs text-white/30">{t.supportedFormats}: {formats}</span>
      </div>

      {/* Upload progress overlay */}
      {uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
          <span className="text-sm text-white">{t.uploading}</span>
          <div className="w-32 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#3B82F6] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success overlay */}
      {success && !uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#10B981]/20 rounded-lg">
          <Check className="w-8 h-8 text-[#10B981] mb-2" />
          <span className="text-sm text-[#10B981]">{t.uploadSuccess}</span>
        </div>
      )}

      {/* Error overlay */}
      {error && !uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/20 rounded-lg">
          <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
          <span className="text-sm text-red-400 text-center px-4">{error}</span>
        </div>
      )}
    </div>
  );
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

  // Upload states for different media types
  const [imageUpload, setImageUpload] = useState<UploadState>({ isUploading: false, progress: 0, error: null, success: false });
  const [videoUpload, setVideoUpload] = useState<UploadState>({ isUploading: false, progress: 0, error: null, success: false });
  const [posterUpload, setPosterUpload] = useState<UploadState>({ isUploading: false, progress: 0, error: null, success: false });
  const [mobileVideoUpload, setMobileVideoUpload] = useState<UploadState>({ isUploading: false, progress: 0, error: null, success: false });

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

  // Upload file to Cloudinary via backend
  const uploadFile = async (
    file: File,
    type: 'image' | 'video' | 'poster' | 'mobileVideo',
    setState: React.Dispatch<React.SetStateAction<UploadState>>
  ) => {
    setState({ isUploading: true, progress: 0, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use XMLHttpRequest for progress tracking
      const result = await new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setState(prev => ({ ...prev, progress }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success) {
                resolve({ url: data.url, publicId: data.path });
              } else {
                reject(new Error(data.error || 'Upload failed'));
              }
            } catch {
              reject(new Error('Invalid response'));
            }
          } else {
            try {
              const data = JSON.parse(xhr.responseText);
              reject(new Error(data.error || 'Upload failed'));
            } catch {
              reject(new Error('Upload failed'));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });

        xhr.open('POST', '/api/admin/banners/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken') || ''}`);
        xhr.send(formData);
      });

      // Update the appropriate field
      if (editingBanner) {
        if (type === 'image') {
          setEditingBanner(prev => prev ? { ...prev, image: result.url } : null);
        } else if (type === 'video') {
          setEditingBanner(prev => prev ? { ...prev, videoUrl: result.url } : null);
        } else if (type === 'poster') {
          setEditingBanner(prev => prev ? { ...prev, posterUrl: result.url } : null);
        } else if (type === 'mobileVideo') {
          setEditingBanner(prev => prev ? { ...prev, mobileVideoUrl: result.url } : null);
        }
      }

      setState({ isUploading: false, progress: 100, error: null, success: true });
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }));
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setState({ isUploading: false, progress: 0, error: errorMessage, success: false });
    }
  };

  // Reset upload state when media type changes
  const resetUploadStates = () => {
    setImageUpload({ isUploading: false, progress: 0, error: null, success: false });
    setVideoUpload({ isUploading: false, progress: 0, error: null, success: false });
    setPosterUpload({ isUploading: false, progress: 0, error: null, success: false });
    setMobileVideoUpload({ isUploading: false, progress: 0, error: null, success: false });
  };

  // Convert Banner to form data
  const bannerToFormData = (banner?: Banner): BannerFormData => ({
    mediaType: banner?.mediaType || 'IMAGE',
    title: banner?.title || "",
    titleZh: banner?.titleZh || "",
    subtitle: banner?.subtitle || "",
    subtitleZh: banner?.subtitleZh || "",
    image: banner?.image || "",
    mobileImage: banner?.mobileImage || "",
    videoUrl: banner?.videoUrl || "",
    posterUrl: banner?.posterUrl || "",
    mobileVideoUrl: banner?.mobileVideoUrl || "",
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
    resetUploadStates();
  };

  const handleAdd = () => {
    setEditingBanner(bannerToFormData());
    setEditingId(null);
    setIsEditing(true);
    resetUploadStates();
  };

  const handleSave = async () => {
    if (!editingBanner) return;

    setSaving(true);
    try {
      const payload = {
        mediaType: editingBanner.mediaType,
        title: editingBanner.title || undefined,
        titleZh: editingBanner.titleZh || undefined,
        subtitle: editingBanner.subtitle || undefined,
        subtitleZh: editingBanner.subtitleZh || undefined,
        image: editingBanner.image || undefined,
        mobileImage: editingBanner.mobileImage || undefined,
        videoUrl: editingBanner.videoUrl || undefined,
        posterUrl: editingBanner.posterUrl || undefined,
        mobileVideoUrl: editingBanner.mobileVideoUrl || undefined,
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

    try {
      await fetch("/api/admin/banners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newBanners.map((b) => b.id) }),
      });
    } catch (err) {
      showToast("Failed to reorder banners", 'error');
      fetchBanners();
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

    try {
      await fetch("/api/admin/banners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newBanners.map((b) => b.id) }),
      });
    } catch (err) {
      showToast("Failed to reorder banners", 'error');
      fetchBanners();
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
                {banner.mediaType === 'VIDEO' ? (
                  banner.videoUrl ? (
                    <div className="relative w-full h-full">
                      {banner.posterUrl && (
                        <Image
                          src={banner.posterUrl}
                          alt={banner.title || "Banner"}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                          <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <Video className="w-6 h-6" />
                    </div>
                  )
                ) : banner.image ? (
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
              {/* Media Type Selector */}
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.mediaType}</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBanner({ ...editingBanner, mediaType: 'IMAGE' });
                      resetUploadStates();
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      editingBanner.mediaType === 'IMAGE'
                        ? "bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10]"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    {t.imageType}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBanner({ ...editingBanner, mediaType: 'VIDEO' });
                      resetUploadStates();
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      editingBanner.mediaType === 'VIDEO'
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10]"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    {t.videoType}
                  </button>
                </div>
              </div>

              {/* Image Upload Section */}
              {editingBanner.mediaType === 'IMAGE' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.image}</label>
                    {editingBanner.image ? (
                      <MediaPreview
                        type="image"
                        src={editingBanner.image}
                        onRemove={() => setEditingBanner({ ...editingBanner, image: '' })}
                      />
                    ) : (
                      <UploadZone
                        type="image"
                        onUpload={(file) => uploadFile(file, 'image', setImageUpload)}
                        uploading={imageUpload.isUploading}
                        progress={imageUpload.progress}
                        error={imageUpload.error}
                        success={imageUpload.success}
                        t={t}
                      />
                    )}
                    {editingBanner.image && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBanner({ ...editingBanner, image: '' })}
                        className="mt-2"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t.replace}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* Video Upload Section */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.video}</label>
                    {editingBanner.videoUrl ? (
                      <MediaPreview
                        type="video"
                        src={editingBanner.videoUrl}
                        poster={editingBanner.posterUrl}
                        onRemove={() => setEditingBanner({ ...editingBanner, videoUrl: '' })}
                      />
                    ) : (
                      <UploadZone
                        type="video"
                        onUpload={(file) => uploadFile(file, 'video', setVideoUpload)}
                        uploading={videoUpload.isUploading}
                        progress={videoUpload.progress}
                        error={videoUpload.error}
                        success={videoUpload.success}
                        t={t}
                      />
                    )}
                    {editingBanner.videoUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBanner({ ...editingBanner, videoUrl: '' })}
                        className="mt-2"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t.replace}
                      </Button>
                    )}
                  </div>

                  {/* Poster Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#E2E8F0] mb-2">{t.posterUrl}</label>
                    {editingBanner.posterUrl ? (
                      <MediaPreview
                        type="image"
                        src={editingBanner.posterUrl}
                        onRemove={() => setEditingBanner({ ...editingBanner, posterUrl: '' })}
                      />
                    ) : (
                      <UploadZone
                        type="image"
                        onUpload={(file) => uploadFile(file, 'poster', setPosterUpload)}
                        uploading={posterUpload.isUploading}
                        progress={posterUpload.progress}
                        error={posterUpload.error}
                        success={posterUpload.success}
                        t={t}
                      />
                    )}
                    {editingBanner.posterUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBanner({ ...editingBanner, posterUrl: '' })}
                        className="mt-2"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t.replace}
                      </Button>
                    )}
                  </div>
                </div>
              )}

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
