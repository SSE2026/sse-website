"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Inbox,
  FileText,
  LogOut,
  Settings,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  enabled: boolean;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard, enabled: true },
  { href: "/admin/products", label: "产品", icon: Package, enabled: true },
  { href: "/admin/news", label: "新闻", icon: Newspaper, enabled: true },
  { href: "/admin/inquiries", label: "询盘", icon: Inbox, enabled: true },
  { href: "/admin/pages", label: "页面内容", icon: FileText, enabled: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession() ?? {};
  const user = session?.user;

  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();
  const displayName = user?.name || user?.email || "Admin";
  const role = user?.role || "ADMIN";

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex md:w-64 flex-col border-r border-[#E4E4E7] bg-white"
      aria-label="Sidebar"
    >
      {/* Brand */}
      <div className="flex h-16 items-center px-5 border-b border-[#F4F4F5]">
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#A1A1AA]">
          工作区
        </div>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            const baseClass = cn(
              "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150",
              isActive
                ? "bg-[#F4F4F5] text-[#0A0A0A]"
                : "text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#0A0A0A]",
              !item.enabled && "opacity-60 cursor-not-allowed",
            );

            if (!item.enabled) {
              return (
                <li key={item.href}>
                  <span
                    aria-disabled
                    title="即将上线"
                    className={baseClass}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span className="flex-1">{item.label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                      即将上线
                    </span>
                  </span>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link href={item.href} className={baseClass}>
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-[#F4F4F5] p-3">
        <div className="flex items-center gap-3 rounded-md p-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-sm font-semibold text-white"
            aria-hidden
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-[#0A0A0A]">
              {displayName}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-sm bg-[#2563EB]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
                {role}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#52525B] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
          退出登录
        </button>
      </div>
    </aside>
  );
}
