"use client";

import Link from "next/link";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-[#EF4444]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          403 - Access Forbidden
        </h1>
        <h2 className="text-xl text-white/80 mb-3">
          权限不足
        </h2>

        {/* Description */}
        <p className="text-white/50 mb-8">
          您没有权限访问此页面。请确认您是否使用了正确的账户登录，或联系管理员获取授权。
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              重新登录
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
