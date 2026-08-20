"use client";

import { useState, createContext, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  Download,
  Settings,
  Users,
  Package,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Admin Context for language
interface AdminContextType {
  locale: "en" | "zh";
  setLocale: (locale: "en" | "zh") => void;
  t: (key: string) => string;
}

const AdminContext = createContext<AdminContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

export const useAdmin = () => useContext(AdminContext);

// Admin translations
const translations = {
  en: {
    dashboard: "Dashboard",
    banners: "Banners",
    partners: "Partners",
    news: "News",
    products: "Products",
    downloads: "Downloads",
    users: "Users",
    settings: "Settings",
    backToWebsite: "Back to Website",
    admin: "Admin",
    signOut: "Sign Out",
    signIn: "Sign In",
    profile: "Profile",
  },
  zh: {
    dashboard: "仪表盘",
    banners: "横幅管理",
    partners: "合作伙伴",
    news: "新闻管理",
    products: "产品管理",
    downloads: "下载管理",
    users: "用户管理",
    settings: "设置",
    backToWebsite: "返回网站",
    admin: "管理员",
    signOut: "退出登录",
    signIn: "登录",
    profile: "个人资料",
  },
};

interface AdminNavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: keyof typeof translations.en;
}

const navItems: AdminNavItem[] = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/admin/banners", icon: ImageIcon, labelKey: "banners" },
  { href: "/admin/partners", icon: Package, labelKey: "partners" },
  { href: "/admin/news", icon: FileText, labelKey: "news" },
  { href: "/admin/products", icon: Package, labelKey: "products" },
  { href: "/admin/downloads", icon: Download, labelKey: "downloads" },
  { href: "/admin/users", icon: Users, labelKey: "users" },
  { href: "/admin/settings", icon: Settings, labelKey: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const pathname = usePathname();
  const router = useRouter();

  // Translation helper
  const t = (key: string) => {
    const keys = key.split(".");
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  // Get user from session (mock for now)
  const user = { name: "Admin", email: "admin@shensafu.com" };
  const isLoggedIn = true;

  return (
    <AdminContext.Provider value={{ locale, setLocale, t }}>
      <div className="min-h-screen bg-[#030712]">
        {/* Top Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0F172A] border-b border-white/[0.06]">
          <div className="flex items-center justify-between h-full px-4 lg:pl-64">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-white/60 hover:text-white"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo (desktop) */}
            <Link href="/admin" className="hidden lg:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Swift Safe Energy Admin
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setLocale(locale === "en" ? "zh" : "en")}
                className="px-3 py-1.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                {locale === "en" ? "EN" : "中文"}
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl bg-[#1E293B] border border-white/[0.08] shadow-xl z-50">
                      <div className="px-4 py-2 border-b border-white/[0.06]">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-white/40">{user.email}</div>
                      </div>
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        {t("profile")}
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        {t("settings")}
                      </Link>
                      <div className="border-t border-white/[0.06] mt-2 pt-2">
                        <button
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("signOut")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-16 left-0 bottom-0 w-64 bg-[#0F172A] border-r border-white/[0.06] z-40 transition-transform lg:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.06]">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("backToWebsite")}</span>
            </Link>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="pt-16 lg:pl-64">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
