"use client";

import { useSession } from "next-auth/react";
import {
  Package,
  Newspaper,
  Inbox,
  FileText,
  ArrowUpRight,
} from "lucide-react";

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string | null;
  status: "ready" | "soon";
}

const modules: ModuleCard[] = [
  {
    id: "products",
    title: "产品",
    description: "系列 / SKU / 规格 / 图片 / 分类",
    icon: Package,
    href: "/admin/products",
    status: "ready",
  },
  {
    id: "news",
    title: "新闻",
    description: "新闻文章 / 分类 / 封面 / SEO 元数据",
    icon: Newspaper,
    href: "/admin/news",
    status: "ready",
  },
  {
    id: "inquiries",
    title: "询盘",
    description: "客户询价 / 状态流转 / 跟进记录",
    icon: Inbox,
    href: "/admin/inquiries",
    status: "ready",
  },
  {
    id: "pages",
    title: "页面内容",
    description: "各页面 Hero / 文案 / 图片 双语编辑",
    icon: FileText,
    href: "/admin/pages",
    status: "ready",
  },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession() ?? {};
  const user = session?.user;
  const displayName = user?.name || user?.email || "管理员";
  const hour = new Date().getHours();
  const greeting =
    hour < 6
      ? "夜深了"
      : hour < 12
      ? "早上好"
      : hour < 18
      ? "下午好"
      : "晚上好";

  return (
    <div className="space-y-6">
      {/* 欢迎区 */}
      <section className="relative overflow-hidden rounded-xl border border-[#E4E4E7] bg-white p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#2563EB]/5"
        />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#71717A]">
            {greeting}
          </p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-tight text-[#0A0A0A] md:text-3xl"
            style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
          >
            欢迎回来，{displayName}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#52525B]">
            这是深安锂能管理后台。在此管理产品、新闻、询盘和页面内容，后端服务由 Vercel 上的 NestJS API 提供。
          </p>
        </div>
      </section>

      {/* 功能模块 */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">
            功能模块
          </h3>
          <span className="text-xs text-[#A1A1AA]">
            已配置 {modules.length} 个模块
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((m) => {
            const Icon = m.icon;
            const inner = (
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F4F4F5] text-[#0A0A0A]"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  {m.status === "soon" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#B45309]">
                      即将上线
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-[#0A0A0A]">
                    {m.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#71717A]">
                    {m.description}
                  </p>
                </div>
                {m.href && (
                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB]">
                      打开
                      <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                    </span>
                  </div>
                )}
              </div>
            );

            const className =
              "group block h-full rounded-xl border border-[#E4E4E7] bg-white p-5 transition-all hover:border-[#0A0A0A] hover:shadow-[0_2px_8px_-2px_rgba(10,10,10,0.08)]";

            return m.href ? (
              <a key={m.id} href={m.href} className={className}>
                {inner}
              </a>
            ) : (
              <div key={m.id} className={className}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* 状态信息 */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#0A0A0A]">后端 API</h4>
            <span className="inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
          </div>
          <p className="mt-1 text-xs text-[#71717A]">NestJS · Neon PostgreSQL · Prisma</p>
          <p className="mt-3 text-xs leading-relaxed text-[#52525B]">
            所有数据操作都通过
            <code className="mx-1 rounded bg-[#F4F4F5] px-1 py-0.5 font-mono text-[11px]">
              NEXT_PUBLIC_API_URL/v1/...
            </code>
            并以 ADMIN 权限的 JWT 访问。
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#0A0A0A]">身份认证</h4>
            <span className="inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
          </div>
          <p className="mt-1 text-xs text-[#71717A]">NextAuth · Credentials · JWT</p>
          <p className="mt-3 text-xs leading-relaxed text-[#52525B]">
            会话基于 JWT，有效期 7 天。ADMIN 角色在中间件和布局层双重校验。
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#0A0A0A]">当前版本</h4>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
              v2.0
            </span>
          </div>
          <p className="mt-1 text-xs text-[#71717A]">完整管理后台</p>
          <p className="mt-3 text-xs leading-relaxed text-[#52525B]">
            已包含产品、新闻、询盘、页面内容等完整管理模块。
          </p>
        </div>
      </section>
    </div>
  );
}
