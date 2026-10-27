// 后端 API 地址的唯一来源，所有 /api/** 代理路由和 NextAuth 的 authorize()
// 都从这里取。
//
// ⚠️ 为什么优先读 `API_BASE_URL` 而不是 `NEXT_PUBLIC_API_URL`
//
// Next.js 会在**构建期**把 `process.env.NEXT_PUBLIC_*` 的值直接内联进产物
// （服务端代码也一样）。这意味着：
//   · 变量必须在构建时就存在，之后再配、或者只在运行时注入，都读不到；
//   · 读到的是构建那一刻的值，改环境变量不会生效。
//
// 这个变量只在服务端用（浏览器从不直接调后端，所有请求都走 Next.js 的
// 代理路由），根本不需要 `NEXT_PUBLIC_` 前缀。去掉前缀后 Next.js 不再内联，
// 于是它读的是**运行时**环境变量 —— 对 EdgeOne 这类只注入运行时变量的
// 平台才是可靠的。
//
// `NEXT_PUBLIC_API_URL` 保留作兼容：本地开发、Vercel 上一直是这么配的。

export const API_PREFIX = "/v1";

/** 返回显式配置的地址；没配返回 null。用于判断「到底配了没有」。 */
export function getConfiguredApiBaseUrl(): string | null {
  const url = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!url || url.trim() === "") return null;
  return url.trim().replace(/\/+$/, "");
}

/** 返回可用的地址，没配时落到本地开发的兜底值。 */
export function getApiBaseUrl(): string {
  return getConfiguredApiBaseUrl() ?? "http://localhost:3001";
}

/** 诊断用：地址是从哪个环境变量读来的。 */
export function getApiBaseUrlSource(): "API_BASE_URL" | "NEXT_PUBLIC_API_URL" | "fallback" {
  if ((process.env.API_BASE_URL ?? "").trim()) return "API_BASE_URL";
  if ((process.env.NEXT_PUBLIC_API_URL ?? "").trim()) return "NEXT_PUBLIC_API_URL";
  return "fallback";
}
