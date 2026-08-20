"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

export default function HomePage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const currentMessages = messages[locale];

  return (
    <>
      <ScrollProgress color="accent" height="sm" />
      <CursorFollower color="rgba(245, 158, 11, 0.08)" size={500} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
          forceLightText={true}
        />
        <main>
          <Hero translations={currentMessages} locale={locale} />
        </main>
        <Footer translations={currentMessages} locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
