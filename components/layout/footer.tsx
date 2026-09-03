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
                <a href="mailto:changhao@ssebatt.com" className="hover:text-white transition-colors">
                  changhao@ssebatt.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#71717A]">
                <Phone className="w-4 h-4 text-[#52525B]" />
                <a href="tel:+8613651071130" className="hover:text-white transition-colors">
                  +86 13651071130
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#71717A]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href="https://wa.me/8613651071130" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
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
