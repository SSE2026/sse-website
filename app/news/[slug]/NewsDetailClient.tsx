"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import type { NewsItem } from "@/data/news";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

interface NewsDetailClientProps {
  item: NewsItem;
}

export function NewsDetailClient({ item }: NewsDetailClientProps) {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const messages = { en, zh };
  const currentMessages = messages[locale];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed top header - 独立站导航 (always light theme for white iframe background) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        />
      </div>

      {/* Spacer for fixed header (72px) */}
      <div className="h-[72px] flex-shrink-0" />

      {/* Iframe with original article (proxied via /api/news/article to bypass X-Frame-Options).
          Iframe auto-sizes to article content height; the parent page scrolls. */}
      <div className="w-full bg-[#F7F8FA]">
        <iframe
          src={`/api/news/article?url=${encodeURIComponent(item.originalUrl)}`}
          title={item.title}
          className="w-full border-0"
          style={{ height: '12000px', minHeight: '100vh' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}