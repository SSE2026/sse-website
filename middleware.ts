import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 只有 /admin 需要登录态。
 *
 * ⚠️ 为什么这里只检查 cookie 是否存在，而不校验 JWT
 *
 * 原来用 next-auth 的 withAuth 在中间件里验签，但中间件跑在**边缘**运行时，
 * 实测（/__mw 探针）它拿到的 AUTH_SECRET 是构建期占位符
 * `dev-secret-for-build-time`，而签发 JWT 的是 Node 运行时的真实
 * NEXTAUTH_SECRET —— 两边对不上，验签必然失败，于是登录成功后访问 /admin
 * 仍然被踢回登录页（表现为「账号密码错误」之后又「进不去后台」）。
 *
 * 边缘运行时读不到这个变量是平台限制，代码层面绕不开。所以中间件退回成
 * 只做「有没有会话 cookie」的快速判断，用于把未登录用户挡在门外、保留
 * 正常的登录跳转体验。
 *
 * 真正的授权没有放松：
 *   · 后台页面对非 ADMIN 会话会跳 /403（app/admin/layout.tsx，客户端）
 *   · 所有后台数据都走 /api/admin/**，那些路由在 Node 运行时用
 *     getServerSession + accessToken 校验，伪造 cookie 拿不到任何数据
 */

const SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const signedIn = SESSION_COOKIE_NAMES.some((name) => req.cookies.has(name));
    if (!signedIn) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/(?!auth)).*)",
  ],
};
