import { NextResponse } from "next/server";
import {
  getApiBaseUrl,
  getConfiguredApiBaseUrl,
  getApiBaseUrlSource,
  API_PREFIX,
} from "@/lib/api/config";

/**
 * 部署诊断（只读）。排查「页面能打开、但登录和询盘都失败」这类问题：
 * 两者都走服务端对后端的 fetch，连不上的表现分别是「账号或密码错误」
 * 和「Internal server error」，光看前端分不出来。
 *
 * 这个接口不碰数据库、不写任何东西，只报告三件事：
 *   1. 服务端实际解析到的后端地址（环境变量配了没有、值是什么）
 *   2. 能不能连上（带超时，不会挂住）
 *   3. 连不上的具体错误
 *
 * 排查完可以删掉；留着也无害 —— 它不暴露任何密钥。
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = getApiBaseUrl();
  const target = `${baseUrl}${API_PREFIX}/health`;

  const startedAt = Date.now();
  let reachable = false;
  let status: number | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(target, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    status = res.status;
    reachable = res.ok;
    if (!res.ok) {
      error = (await res.text().catch(() => "")).slice(0, 200) || `HTTP ${res.status}`;
    }
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return NextResponse.json({
    // 是否配置了后端地址。false 说明落到了 localhost:3001 的兜底值。
    configured: getConfiguredApiBaseUrl() !== null,
    // 地址是从哪个变量读来的。fallback = 两个都没配；
    // NEXT_PUBLIC_API_URL 在构建期被内联，只有构建时存在才读得到。
    envSource: getApiBaseUrlSource(),
    apiBaseUrl: baseUrl,
    // 健康检查地址
    target,
    reachable,
    status,
    error,
    latencyMs: Date.now() - startedAt,
    // NextAuth 这两项只报「配没配」，不报值。缺 secret 时会退到构建期
    // 占位符（登录仍可用但会话不安全）；缺 url 时回调地址可能算错。
    nextauthUrlConfigured: (process.env.NEXTAUTH_URL ?? "").trim().length > 0,
    nextauthSecretConfigured: (process.env.NEXTAUTH_SECRET ?? "").trim().length > 0,
  });
}
