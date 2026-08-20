import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Noto Sans SC - 作为中文字体
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deep Safe Lithium Energy | Solid-State Battery Technology",
  description:
    "Leading innovator in solid-state battery technology. Developing next-generation energy storage solutions for EVs, drones, robotics, and consumer electronics.",
  keywords: [
    "solid-state battery",
    "EV battery",
    "energy storage",
    "lithium battery",
    "next-generation battery",
    "drone battery",
  ],
  authors: [{ name: "Deep Safe Lithium Energy" }],
  openGraph: {
    title: "Deep Safe Lithium Energy | Solid-State Battery Technology",
    description:
      "Leading innovator in solid-state battery technology for the future of energy.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansSC.variable}`}>
      <body className="min-h-screen bg-primary font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
