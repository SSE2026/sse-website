"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  translations: {
    footer: {
      description: string;
      quickLinks: string;
      products: string;
      technology: string;
      about: string;
      contact: string;
      legal: string;
      privacy: string;
      terms: string;
      copyright: string;
      getInTouch: string;
      newsletter: string;
      newsletterDesc: string;
    };
    nav: {
      products: string;
      technology: string;
      about: string;
      contact: string;
    };
    [key: string]: any;
  };
  locale: string;
}

export function Footer({ translations, locale }: FooterProps) {
  const quickLinks = [
    { href: "/products/cloudchi-360-p", label: translations.nav.products, key: "quick-products" },
    { href: "/technology", label: translations.nav.technology, key: "quick-technology" },
    { href: "/about", label: translations.nav.about, key: "quick-about" },
    { href: "/contact", label: translations.nav.contact, key: "quick-contact" },
    { href: "/news", label: locale === "zh" ? "新闻动态" : "News", key: "quick-news" },
  ];

  return (
    <footer className="relative bg-[#0A0A0A]">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative container-padding mx-auto">
        {/* Main Footer Content - Tesla Style Grid */}
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column - Wider */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 cursor-pointer">
              <Image
                src="/logo.png"
                alt="深安锂能"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="font-semibold text-white text-sm leading-tight">
                  {locale === "zh" ? "深安锂能" : "Swift Safe Energy"}
                </p>
                <p className="text-[10px] text-[#71717A]">
                  {locale === "zh" ? "高比能高安全新型电池引领者" : "Pioneering High-Energy, High-Safety Battery Technology"}
                </p>
              </div>
            </Link>
            <p className="text-sm text-[#71717A] leading-relaxed max-w-sm mb-6">
              {translations.footer.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#71717A]">
                <MapPin className="w-4 h-4 text-[#52525B]" />
                <span>{locale === "zh" ? "深圳市坪山区源通科技园" : "Shenzhen, China"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#71717A]">
                <Mail className="w-4 h-4 text-[#52525B]" />
                <a href="mailto:zhanwenwei@ssebatt.com" className="hover:text-white transition-colors">
                  zhanwenwei@ssebatt.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#71717A]">
                <Phone className="w-4 h-4 text-[#52525B]" />
                <a href="tel:+8615814654041" className="hover:text-white transition-colors">
                  15814654041
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6">
              {translations.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#71717A] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 微信公众号二维码 —— 原来这里是 GitHub / LinkedIn / Twitter /
              YouTube 四个占位链接（href 全是 #，点了什么也不会发生），
              已全部删除，换成真正能扫的公众号入口。 */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6">
              {locale === "zh" ? "关注我们" : "Follow Us"}
            </h4>
            <div className="flex items-start gap-4">
              <Image
                src="/images/wechat-qrcode.jpg"
                alt={locale === "zh" ? "深安锂能微信公众号二维码" : "Swift Safe Energy WeChat QR code"}
                width={258}
                height={258}
                sizes="180px"
                className="h-[88px] w-[88px] shrink-0 rounded-lg bg-white p-1.5 object-contain"
              />
              <div className="pt-0.5">
                <p className="text-sm font-medium text-white">
                  {locale === "zh" ? "微信公众号" : "WeChat"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#71717A]">
                  {locale === "zh" ? "扫码关注，获取最新动态" : "Scan to follow our updates"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#27272A]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#52525B]">
              {translations.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
