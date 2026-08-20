"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Building,
  FileText,
  Image as ImageIcon,
  Bell,
  Shield,
  Database,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Settings translations
const settingsTranslations = {
  en: {
    title: "Settings",
    subtitle: "Manage your site configuration",
    general: "General",
    siteInfo: "Site Information",
    companyName: "Company Name",
    companyNameEn: "Company Name (English)",
    description: "Description",
    contact: "Contact Information",
    email: "Email",
    phone: "Phone",
    address: "Address",
    social: "Social Media",
    seo: "SEO Settings",
    siteTitle: "Site Title",
    siteTitleZh: "Site Title (Chinese)",
    metaDescription: "Meta Description",
    metaKeywords: "Meta Keywords",
    logo: "Logo",
    favicon: "Favicon",
    uploadLogo: "Upload Logo",
    uploadFavicon: "Upload Favicon",
    notifications: "Notifications",
    emailNotifications: "Email Notifications",
    contactFormAlerts: "Contact Form Alerts",
    data: "Data Management",
    exportData: "Export Data",
    importData: "Import Data",
    cache: "Cache Management",
    clearCache: "Clear Cache",
    save: "Save Changes",
    saving: "Saving...",
    saved: "Saved!",
  },
  zh: {
    title: "设置",
    subtitle: "管理网站配置",
    general: "常规设置",
    siteInfo: "网站信息",
    companyName: "公司名称",
    companyNameEn: "公司名称（英文）",
    description: "描述",
    contact: "联系方式",
    email: "邮箱",
    phone: "电话",
    address: "地址",
    social: "社交媒体",
    seo: "SEO 设置",
    siteTitle: "网站标题",
    siteTitleZh: "网站标题（中文）",
    metaDescription: "Meta 描述",
    metaKeywords: "Meta 关键词",
    logo: "Logo",
    favicon: "网站图标",
    uploadLogo: "上传 Logo",
    uploadFavicon: "上传图标",
    notifications: "通知设置",
    emailNotifications: "邮件通知",
    contactFormAlerts: "联系表单提醒",
    data: "数据管理",
    exportData: "导出数据",
    importData: "导入数据",
    cache: "缓存管理",
    clearCache: "清除缓存",
    save: "保存更改",
    saving: "保存中...",
    saved: "已保存！",
  },
};

interface SiteSettings {
  companyName: string;
  companyNameEn: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  siteTitle: string;
  siteTitleZh: string;
  metaDescription: string;
  metaKeywords: string;
  emailNotifications: boolean;
  contactFormAlerts: boolean;
}

export default function SettingsPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const t = settingsTranslations[isLocale];

  const [settings, setSettings] = useState<SiteSettings>({
    companyName: "深安锂能（深圳）科技有限公司",
    companyNameEn: "Swift Safe Energy (Shenzhen) Technology Co., Ltd.",
    description: "突破能量极限，重塑电动边界",
    email: "contact@shensafu.com",
    phone: "+86 755-1234 5678",
    address: "深圳市南山区科技园南区",
    siteTitle: "Swift Safe Energy",
    siteTitleZh: "深安锂能",
    metaDescription: "High energy density, ultra-safe solid-state battery solutions for low-altitude flight, embodied AI, and deep-sea equipment.",
    metaKeywords: "solid-state battery, lithium battery, drone battery, robot battery, energy storage",
    emailNotifications: true,
    contactFormAlerts: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-[#10B981]">{t.saved}</span>
          )}
          <Button onClick={handleSave} loading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? t.saving : t.save}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Site Information */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                <Building className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t.siteInfo}</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.companyName}
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
                <Input
                  label={t.companyNameEn}
                  value={settings.companyNameEn}
                  onChange={(e) => setSettings({ ...settings, companyNameEn: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.description}
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t.contact}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t.email}
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label={t.phone}
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <div className="col-span-2">
                <Input
                  label={t.address}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t.seo}</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.siteTitle}
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                />
                <Input
                  label={t.siteTitleZh}
                  value={settings.siteTitleZh}
                  onChange={(e) => setSettings({ ...settings, siteTitleZh: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.metaDescription}
                </label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>

              <Input
                label={t.metaKeywords}
                value={settings.metaKeywords}
                onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                hint="Separate keywords with commas"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Logo & Favicon */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t.logo}</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">{t.logo}</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <Building className="w-8 h-8 text-white/30" />
                  </div>
                  <Button variant="outline" size="sm">
                    {t.uploadLogo}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-2">{t.favicon}</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white/30" />
                  </div>
                  <Button variant="outline" size="sm">
                    {t.uploadFavicon}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t.notifications}</h2>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">{t.emailNotifications}</span>
                <div
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? "bg-[#3B82F6]" : "bg-[#334155]"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">{t.contactFormAlerts}</span>
                <div
                  onClick={() => setSettings({ ...settings, contactFormAlerts: !settings.contactFormAlerts })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    settings.contactFormAlerts ? "bg-[#3B82F6]" : "bg-[#334155]"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.contactFormAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#EF4444]/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t.data}</h2>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                {t.exportData}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                {t.importData}
              </Button>
              <Button variant="outline" className="w-full justify-start text-[#EF4444] hover:text-[#EF4444]">
                <Shield className="w-4 h-4 mr-2" />
                {t.clearCache}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
