"use client";

import { useEffect, useState } from "react";

/**
 * Fetch page content from the public CMS proxy (/api/content/:page?locale=).
 * Returns the content object (empty {} when unset) so callers can fall back.
 */
export function useCmsContent(page: string, locale: string): Record<string, unknown> {
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/content/${page}?locale=${locale}`, {
          next: { revalidate: 60 },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        setContent((data?.content ?? {}) as Record<string, unknown>);
      } catch {
        // fall back to empty content; callers keep their defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, locale]);

  return content;
}
