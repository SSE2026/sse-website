/**
 * Browser locale cookie helpers.
 *
 * Phase 1: persist the user's manual locale choice across page navigations.
 * Phase 2 (domain-aware default): when no NEXT_LOCALE cookie is present,
 * resolve the initial locale from the current request host.
 *
 * Resolution priority (strict):
 *   1. NEXT_LOCALE cookie on the current host → use cookie
 *   2. Hostname → ssebatt.com / www.ssebatt.com → "zh"
 *   3. Hostname → sse-website.vercel.app / other Vercel / localhost / unknown → "en"
 *
 * Hydration contract:
 *   - SSR (no window): resolveInitialLocale() returns the cookie value or "en".
 *     Client components will read window.location.hostname on first effect
 *     and re-resolve if the SSR value disagreed with the host-aware value.
 *   - Client first render: reads window.location.hostname synchronously
 *     inside the useState initializer.
 *   - The cookie is captured once at hydration time so a user toggling
 *     languages cannot be silently reverted by the host default on remount.
 */

export const LOCALE_COOKIE = "NEXT_LOCALE";
export type Locale = "en" | "zh";

const VALID: ReadonlyArray<Locale> = ["en", "zh"];

const HOST_ZH = new Set<string>(["ssebatt.com", "www.ssebatt.com"]);
const HOST_EN = new Set<string>(["sse-website.vercel.app"]);

function isLocale(v: string | null | undefined): v is Locale {
  return v === "en" || v === "zh";
}

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
 * Map a hostname to its default locale. Returns null for unrecognized hosts
 * so the caller can decide (today: fall back to "en").
 */
export function getDefaultLocaleForHost(host: string | null): Locale | null {
  if (!host) return null;
  const h = host.toLowerCase().split(":")[0]; // strip port
  if (HOST_ZH.has(h)) return "zh";
  if (HOST_EN.has(h)) return "en";
  // Vercel preview deployments: anything ending in .vercel.app → en
  if (h.endsWith(".vercel.app")) return "en";
  // localhost / 127.0.0.1 / unknown → en
  return "en";
}

/**
 * Resolve the initial locale for a client component.
 *
 * Priority (strict):
 *   1. NEXT_LOCALE cookie on the current host (user explicit choice).
 *   2. Hostname → zh for ssebatt.com / www.ssebatt.com, else en.
 *   3. Hard fallback: "en" (SSR with no host info, or unknown host).
 *
 * SSR-safe: when window is undefined the host-derived branch is skipped and
 * the function returns the cookie value or "en". Client components should
 * call this from a useState lazy initializer AND from a first-mount effect
 * to correct any SSR/client divergence.
 */
export function resolveInitialLocale(): Locale {
  const fromCookie = getLocaleCookie();
  if (fromCookie) return fromCookie;
  if (typeof window === "undefined") return "en";
  return getDefaultLocaleForHost(window.location.hostname) ?? "en";
}

export const SUPPORTED_LOCALES = VALID;
