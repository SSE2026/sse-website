"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", key: "social-github" },
    { icon: Linkedin, href: "#", label: "LinkedIn", key: "social-linkedin" },
    { icon: Twitter, href: "#", label: "Twitter", key: "social-twitter" },
    { icon: Youtube, href: "#", label: "YouTube", key: "social-youtube" },
  ];

  const quickLinks = [
    { href: "/products/cloudchi-360-p", label: translations.nav.products, key: "quick-products" },
    { href: "/technology", label: translations.nav.technology, key: "quick-technology" },
    { href: "/about", label: translations.nav.about, key: "quick-about" },
    { href: "/contact", label: translations.nav.contact, key: "quick-contact" },
    { href: "/news", label: locale === "zh" ? "新闻动态" : "News", key: "quick-news" },
  ];

  const legalLinks = [
    { href: "#", label: translations.footer.privacy, key: "legal-privacy" },
    { href: "#", label: translations.footer.terms, key: "legal-terms" },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[#27272A]">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative container-padding mx-auto">
        {/* Main Footer Content - Tesla Style Grid */}
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
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
                  {locale === "zh" ? "高比能电池专家" : "High Energy Density Battery Expert"}
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
                <a href="tel:+8618810311215" className="hover:text-white transition-colors">
                  +86 188 1031 1215
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

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6">
              {translations.footer.legal}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
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

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6">
              {locale === "zh" ? "关注我们" : "Follow Us"}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "w-10 h-10 rounded-lg bg-[#18181B] border border-[#27272A]",
                    "flex items-center justify-center",
                    "text-[#71717A] hover:text-white hover:bg-[#27272A] hover:border-[#3F3F46]",
                    "transition-all duration-200 cursor-pointer"
                  )}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#27272A]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#52525B]">
              {translations.footer.copyright}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-[#52525B]">
                {locale === "zh" ? "粤ICP备XXXXXXXX号" : "ICP License XXXXXXXX"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
