"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  translations: {
    nav: {
      home: string;
      about: string;
      products: string;
      technology: string;
      cases: string;
      industries: string;
      news: string;
      contact: string;
    };
    [key: string]: any;
  };
  locale: string;
  onLocaleChange: (locale: string) => void;
  forceLightText?: boolean; // Use light text for dark backgrounds (e.g., homepage with dark hero)
}

export function Header({ translations, locale, onLocaleChange, forceLightText = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: "/", label: translations.nav.home, key: "home" },
    { href: "/about", label: translations.nav.about, key: "about" },
    { href: "/products/cloudchi-360-p", label: translations.nav.products, key: "products" },
    { href: "/technology", label: translations.nav.technology, key: "technology" },
    { href: "/cases", label: translations.nav.cases, key: "cases" },
    { href: "/news", label: translations.nav.news, key: "news" },
  ];

  return (
    <>
      {/* Header - Tesla Style Glassmorphism */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-[#E4E4E7]/50"
            : "bg-transparent"
        )}
      >
        <div className="container-padding mx-auto">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/logo.png"
                  alt="深安锂能"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </motion.div>
              <div className="hidden sm:block">
                <p className={cn(
                  "font-semibold text-sm leading-tight transition-colors duration-300",
                  forceLightText && !isScrolled ? "text-white group-hover:text-[#60A5FA]" : "text-[#0A0A0A] group-hover:text-[#2563EB]"
                )}>
                  {locale === "zh" ? "深安锂能" : "Swift Safe Energy"}
                </p>
                <p className={cn(
                  "text-[10px] transition-colors duration-300",
                  forceLightText && !isScrolled ? "text-[#52525B]" : "text-[#A1A1AA]"
                )}>
                  {locale === "zh" ? "高比能电池专家" : "High Energy Density Battery Expert"}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation - Clean & Minimal */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      "hover:bg-[#F4F4F5]",
                      activeLink === item.key
                        ? "text-[#0A0A0A] bg-[#F4F4F5]"
                        : forceLightText && !isScrolled ? "text-white" : "text-[#18181B]"
                    )}
                    onMouseEnter={() => setActiveLink(item.key)}
                    onMouseLeave={() => setActiveLink("")}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Side - Tesla Style */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onLocaleChange(locale === "en" ? "zh" : "en")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#52525B] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-all duration-200 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium hidden sm:inline">{locale}</span>
              </motion.button>

              {/* Contact Button - Tesla Blue */}
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer",
                    forceLightText && !isScrolled
                      ? "bg-white text-[#0A0A0A] hover:bg-[#F4F4F5]"
                      : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                  )}
                >
                  {locale === "zh" ? "联系我们" : "Contact"}
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "lg:hidden p-2 rounded-md transition-all duration-200 cursor-pointer",
                  isScrolled
                    ? "text-[#52525B] hover:bg-[#F4F4F5]"
                    : "text-[#52525B] hover:bg-[#F4F4F5]"
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Slide from Right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content - Slide in from right */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E4E4E7]">
                <span className="font-semibold text-[#0A0A0A]">
                  {locale === "zh" ? "菜单" : "Menu"}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#52525B] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-all duration-200 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="p-6 flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md transition-all duration-200",
                        "text-[#52525B] hover:text-[#0A0A0A] hover:bg-[#F4F4F5]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Contact Button in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.1, duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-[#E4E4E7]"
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-all duration-200"
                  >
                    {locale === "zh" ? "联系我们" : "Contact Us"}
                  </Link>
                </motion.div>

                {/* Language Switcher in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.15, duration: 0.3 }}
                  className="mt-3"
                >
                  <button
                    onClick={() => {
                      onLocaleChange(locale === "en" ? "zh" : "en");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-[#52525B] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-all duration-200 cursor-pointer"
                  >
                    <Globe className="w-5 h-5" />
                    {locale === "zh" ? "切换至 English" : "切换至 中文"}
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
