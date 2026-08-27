"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/header";
import { getNewsBySlug } from "@/data/news";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

export default function NewsDetailClient() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const item = getNewsBySlug(slug);

  const [locale, setLocale] = useState<"en" | "zh">("en");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Default to a tall value so even before the first postMessage the
  // full article is visible (article 22 is ~12000px tall).
  const [iframeHeight, setIframeHeight] = useState(14000);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Only trust messages from our own iframe.
      const data = event.data;
      if (
        data &&
        typeof data === "object" &&
        data.type === "sse-article-height" &&
        typeof data.height === "number" &&
        data.height > 0 &&
        data.height < 200000
      ) {
        setIframeHeight(Math.ceil(data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!item) {
    notFound();
  }

  const messages = { en, zh };
  const currentMessages = messages[locale];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed top header - 独立站导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        />
      </div>

      {/* Spacer for fixed header (72px) */}
      <div className="h-[72px] flex-shrink-0" />

      {/* Iframe with original article (proxied via /api/news/article).
          Height is dynamically updated by the iframe via postMessage so the
          full article (article 22 ≈ 12000px) is always visible. */}
      <iframe
        ref={iframeRef}
        src={`/api/news/article?url=${encodeURIComponent(item.originalUrl)}`}
        title={item.title}
        className="w-full border-0 block"
        style={{ height: `${iframeHeight}px`, display: 'block' }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
