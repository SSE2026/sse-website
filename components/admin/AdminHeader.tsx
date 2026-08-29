"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, HelpCircle, Search } from "lucide-react";

const titleMap: Record<string, { label: string; zh: string }> = {
  "/admin": { label: "仪表盘", zh: "仪表盘" },
  "/admin/products": { label: "产品管理", zh: "产品管理" },
  "/admin/news": { label: "新闻管理", zh: "新闻管理" },
  "/admin/inquiries": { label: "询盘管理", zh: "询盘管理" },
  "/admin/pages": { label: "页面内容", zh: "页面内容" },
};

function resolveTitle(pathname: string): { label: string; zh: string } {
  if (titleMap[pathname]) return titleMap[pathname];
  const sorted = Object.keys(titleMap).sort((a, b) => b.length - a.length);
  for (const key of sorted) {
    if (pathname.startsWith(key)) return titleMap[key];
  }
  return { label: "管理后台", zh: "管理后台" };
}

export function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession() ?? {};
  const title = resolveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E4E4E7] bg-white/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex flex-col leading-none">
        <h1
          className="text-base font-semibold tracking-tight text-[#0A0A0A]"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
        >
          {title.label}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center gap-2 rounded-md border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs text-[#71717A] mr-2 w-64">
          <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>搜索</span>
          <kbd className="ml-auto rounded border border-[#E4E4E7] bg-[#FAFAFA] px-1.5 py-0.5 font-mono text-[10px] text-[#A1A1AA]">
            ⌘K
          </kbd>
        </div>
        <button
          type="button"
          className="rounded-md p-2 text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]"
          aria-label="通知"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="rounded-md p-2 text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]"
          aria-label="帮助"
        >
          <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
        </button>
        {session?.user && (
          <div className="ml-2 hidden items-center gap-2 border-l border-[#E4E4E7] pl-3 md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-[11px] font-semibold text-white">
              {(session.user.name || session.user.email || "?")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-medium text-[#0A0A0A]">
                {session.user.name || session.user.email}
              </span>
              <span className="text-[10px] text-[#71717A]">{session.user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
