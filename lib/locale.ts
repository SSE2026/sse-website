/**
 * Browser locale helpers.
 *
 * ## 为什么默认语言是「构建期常量」而不是按 cookie / hostname 猜
 *
 * 这些页面全部是 **SSG 预渲染**的。构建时既没有 cookie,也没有 hostname ——
 * 服务端只能渲染一个固定的语言,而且它**只可能是构建时定下的那个**。
 *
 * 之前的实现让客户端按 cookie/hostname 猜(可能得到 "zh")、服务端恒定 "en",
 * 两边首帧不一致 → React 19 抛 hydration `#418`,**丢弃整份服务端 HTML、
 * 整棵树客户端重渲染**。后果:中文访客先闪一屏英文;中文站的服务端渲染完全白做
 * (等于退化成 CSR)。
 *
 * 现在让**服务端与客户端首帧返回同一个值**(构建期默认语言),分歧留到挂载后再纠正
 * —— Header 里有个 effect 会读 cookie 把用户手动选过的语言切过去。
 *
 * 默认语言是**中文**。想用英文的部署显式设 `NEXT_PUBLIC_DEFAULT_LOCALE=en`:
 *   · 国内镜像(EdgeOne / CloudBase) → 不设,落到 "zh"
 *   · 境外部署想给英文     → 设 `NEXT_PUBLIC_DEFAULT_LOCALE=en`
 *
 * ⚠️ 前提是「中英文各一个部署」。若将来要**同一个构建同时服务两个域名**,
 * 环境变量区分不了,只能回到 middleware 按 Host 判断,而那会把所有页面
 * 从静态预渲染变成动态渲染(ƒ Dynamic),代价大得多。
 */

export const LOCALE_COOKIE = "NEXT_LOCALE";
export type Locale = "en" | "zh";

const VALID: ReadonlyArray<Locale> = ["en", "zh"];

function isLocale(v: string | null | undefined): v is Locale {
  return v === "en" || v === "zh";
}

/**
 * 本部署的默认语言 —— 构建期内联。服务端与客户端首帧都用它,所以两边一致。
 * 未设环境变量时落到中文(主站是中文站)。
 */
const CONFIGURED_DEFAULT = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
export const DEFAULT_LOCALE: Locale = isLocale(CONFIGURED_DEFAULT)
  ? CONFIGURED_DEFAULT
  : "zh";

function readCookieRaw(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + LOCALE_COOKIE + "=(en|zh)"),
  );
  return m ? m[1] : null;
}

/** Read the user-chosen locale from `document.cookie`. SSR-safe (returns null). */
export function getLocaleCookie(): Locale | null {
  const v = readCookieRaw();
  return isLocale(v) ? v : null;
}

/** Write the locale cookie. 1 year expiry, root path, lax SameSite, host-only. */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie =
    LOCALE_COOKIE + "=" + locale + "; path=/; max-age=31536000; samesite=lax";
}

/**
 * 首帧语言 —— 服务端与客户端都返回同一个构建期常量,保证 hydration 一致。
 *
 * 用户手动选过的语言在**挂载后**由 Header 里的 effect 纠正(读 cookie),
 * 所以这里不要再读 cookie,否则服务端/客户端又会不一致。
 */
export function resolveInitialLocale(): Locale {
  return DEFAULT_LOCALE;
}

export const SUPPORTED_LOCALES = VALID;
