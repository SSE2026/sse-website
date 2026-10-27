import { NextResponse } from "next/server";
import { getApiBaseUrl, API_PREFIX } from "@/lib/api/config";

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
  const configuredValue = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
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
    // 环境变量是否配置。false 说明落到了 localhost:3001 的兜底值。
    configured: configuredValue.length > 0,
    // 服务端实际使用的基础地址
    apiBaseUrl: baseUrl,
    // 健康检查地址
    target,
    reachable,
    status,
    error,
    latencyMs: Date.now() - startedAt,
  });
}
