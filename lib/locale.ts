/**
 * Browser locale cookie helpers.
 *
 * Phase 1: persist the user's manual locale choice across page navigations.
 * Phase 2 (next-intl domain-aware default): the `getDefaultLocaleForHost` hook
 * is the seam where we will resolve "no cookie set" against the request host.
 */

export const LOCALE_COOKIE = "NEXT_LOCALE";
export type Locale = "en" | "zh";

const VALID: ReadonlyArray<Locale> = ["en", "zh"];

function isLocale(v: string | null | undefined): v is Locale {
  return v === "en" || v === "zh";
}

/** Read the user-chosen locale from `document.cookie`. SSR-safe (returns null). */
export function getLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + LOCALE_COOKIE + "=(en|zh)"),
  );
  const v = m ? m[1] : null;
  return isLocale(v) ? v : null;
}

/** Write the locale cookie. 1 year expiry, root path, lax SameSite. */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie =
    LOCALE_COOKIE + "=" + locale + "; path=/; max-age=31536000; samesite=lax";
}

/**
 * Resolve the initial locale for a client component.
 * Priority: user cookie → caller-provided default ("en" today).
 *
 * Phase 2 will plug in a host-aware default between cookie and fallback.
 */
export function resolveInitialLocale(fallback: Locale = "en"): Locale {
  const fromCookie = getLocaleCookie();
  return fromCookie ?? fallback;
}

/**
 * Phase 2 seam: given a request host, return the locale this domain should
 * serve by default when the user has not made an explicit choice.
 * Today it just returns `null` (caller falls back to "en"). Tomorrow it will
 * map `sse-website.vercel.app → 'en'`, `ssebatt.com / www.ssebatt.com → 'zh'`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDefaultLocaleForHost(_host: string | null): Locale | null {
  return null;
}

export const SUPPORTED_LOCALES = VALID;
