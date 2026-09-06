"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "邮箱或密码错误，请重试。";
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
        return "OAuth 登录出错，请重试。";
      case "EmailCreateAccount":
        return "创建账户失败。";
      case "Callback":
        return "回调处理出错。";
      case "OAuthAccountNotLinked":
        return "此邮箱已关联其他登录方式。";
      case "EmailSignin":
        return "邮箱登录失败。";
      case "CredentialsSignin":
        return "凭证登录失败。";
      case "session_required":
        return "请先登录。";
      case "session_expired":
        return "登录已过期或会话已失效，请重新登录。";
      default:
        return "发生未知错误，请重试。";
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-[#F59E0B]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Authentication Error
        </h1>
        <h2 className="text-xl text-white/80 mb-3">
          认证错误
        </h2>

        {/* Error Message */}
        <p className="text-white/50 mb-8">
          {getErrorMessage(error)}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button className="gap-2">
              重新登录
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
