"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocaleCookie, setLocaleCookie } from "@/lib/locale";

interface HeaderProps {
  translations: {
    nav: {
      home: string;
      about: string;
      products: string;
      productsCells: string;
      productsCellsCloudchi360P: string;
      productsCellsCloudchi400E: string;
      productsCellsCloudchi460X: string;
      productsCellsPanshi: string;
      productsPacks: string;
      technology: string;
      cases: string;
      industries?: {
        lowAltitude: string;
        embodiedAI: string;
        marine: string;
        specialOps: string;
      };
      news: string;
      contact: string;
    };
    [key: string]: any;
  };
  locale: string;
  onLocaleChange: (locale: string) => void;
  forceLightText?: boolean;
}

// ----- Nav tree types -----------------------------------------------------
// A flat leaf is just { label, href }. A group has children; the first
// level under "Products" is a label-only header (e.g. "Cells"), whose
// own children are leaf links (e.g. "AeroRide", "FortiCore").
type NavLeaf = { label: string; href: string };
type NavGroupChild = NavLeaf | { label: string; children: NavLeaf[] };
type NavItem =
  | { kind: "leaf"; key: string; label: string; href: string }
  | {
      kind: "menu";
      key: string;
      label: string;
      /** 省略 = 顶层只展开下拉、不跳转;有值则点击同时跳转 */
      href?: string;
      children: NavGroupChild[];
    };

export function Header({ translations, locale, onLocaleChange, forceLightText = false }: HeaderProps) {
  const nav = translations.nav;

  const navTree: NavItem[] = [
    { kind: "leaf", key: "home", label: nav.home, href: "/" },
    // "Products" is dropdown-only: the top-level label opens the panel but
    // does not navigate — users pick a sub-page from the menu.
    {
      kind: "menu",
      key: "products",
      label: nav.products,
      children: [
        {
          label: nav.productsCells,
          children: [
            { label: nav.productsCellsCloudchi360P, href: "/products/cloudchi-360-p" },
            { label: nav.productsCellsCloudchi400E, href: "/products/cloudchi-400-e" },
            { label: nav.productsCellsCloudchi460X, href: "/products/cloudchi-460-x" },
            { label: nav.productsCellsPanshi, href: "/products/cells/panshi" },
          ],
        },
        { label: nav.productsPacks, href: "/products/packs" },
      ],
    },
    // "Solutions" is a flat 4-item dropdown — no intermediate index
    // page. Each leaf points directly to the industry detail page.
    {
      kind: "menu",
      key: "cases",
      label: nav.cases,
      href: "/solutions/low-altitude",
      children: [
        { label: nav.industries?.lowAltitude ?? "低空飞行器", href: "/solutions/low-altitude" },
        { label: nav.industries?.embodiedAI ?? "具身智能机器人", href: "/solutions/embodied-ai" },
        { label: nav.industries?.marine ?? "海洋装备", href: "/solutions/marine" },
        { label: nav.industries?.specialOps ?? "特种装备", href: "/solutions/special-ops" },
      ],
    },
    { kind: "leaf", key: "technology", label: nav.technology, href: "/technology" },
    { kind: "leaf", key: "news", label: nav.news, href: "/news" },
    { kind: "leaf", key: "about", label: nav.about, href: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  // Hover-driven nav state. Track which top-level item is open AND which
  // group child (e.g. "Cells") is open so the nested sub-panel can fly out.
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const [openSubLabel, setOpenSubLabel] = useState<string | null>(null);
  // Mobile: track which top-level menu item is expanded inline.
  const [mobileExpandedKey, setMobileExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // 服务端只会渲染构建期默认语言(SSG 读不到 cookie),所以**手动切过语言**的
  // 用户要在挂载后纠正过来。
  // 放在 Header 里是因为每个页面都渲染它 —— 一处覆盖全站,那 16 个页面的
  // `useState(() => resolveInitialLocale())` 一行都不用动。
  useEffect(() => {
    const saved = getLocaleCookie();
    if (saved && saved !== locale) onLocaleChange(saved);
    // 只在挂载时跑一次:之后语言由用户点击驱动,不再从 cookie 回灌
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `<html lang>` 是服务端按构建期默认语言写死的,但访客可以点语言切换改内容。
  // 不同步的话,切成英文的访客会拿到 lang="zh" —— 读屏软件按中文读音念英文、
  // 浏览器不提示翻译、断行规则也用错。挂载时跑一次,之后每次 locale 变化都跟着改。
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Close hover-menu when cursor leaves the entire nav region.
  // `activeLink` paints the hover background on the top-level items, so it
  // has to be reset here too — otherwise the highlight sticks once the
  // cursor moves off the nav.
  const onNavMouseLeave = () => {
    setOpenMenuKey(null);
    setOpenSubLabel(null);
    setActiveLink("");
  };

  const linkBaseClass = cn(
    "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
    "hover:bg-[#F4F4F5]"
  );

  const colorFor = (active: boolean) =>
    active
      ? "text-[#0A0A0A] bg-[#F4F4F5]"
      : forceLightText && !isScrolled
      ? "text-white"
      : "text-[#18181B]";

  return (
    <>
      {/* Header - Tesla Style Glassmorphism */}
      <motion.header
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                  "text-[10px] transition-colors duration-300 leading-snug max-w-[260px]",
                  forceLightText && !isScrolled ? "text-[#52525B]" : "text-[#A1A1AA]"
                )}>
                  {locale === "zh"
                    ? "高比能高安全新型电池引领者"
                    : "Pioneer in High-Energy-Density, High-Safety Next-Gen Power Batteries"}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1"
              onMouseLeave={onNavMouseLeave}
            >
              {navTree.map((item, index) => {
                if (item.kind === "leaf") {
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          linkBaseClass,
                          activeLink === item.key ? "text-[#0A0A0A] bg-[#F4F4F5]" : colorFor(false)
                        )}
                        onMouseEnter={() => {
                          setActiveLink(item.key);
                          setOpenMenuKey(null);
                          setOpenSubLabel(null);
                        }}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                }

                // ---- Menu item (Products with sub-items) ----
                const isOpen = openMenuKey === item.key;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="relative"
                    onMouseEnter={() => {
                      setActiveLink(item.key);
                      setOpenMenuKey(item.key);
                    }}
                  >
                    {(() => {
                      const triggerClass = cn(
                        linkBaseClass,
                        "inline-flex items-center gap-1",
                        isOpen || activeLink === item.key
                          ? "text-[#0A0A0A] bg-[#F4F4F5]"
                          : colorFor(false)
                      );
                      const triggerContent = (
                        <>
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 transition-transform duration-200",
                              isOpen ? "rotate-180" : ""
                            )}
                          />
                        </>
                      );

                      // 没配 href 的顶层菜单只展开下拉,不跳转
                      return item.href ? (
                        <Link href={item.href} className={triggerClass}>
                          {triggerContent}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          className={cn(triggerClass, "cursor-pointer")}
                        >
                          {triggerContent}
                        </button>
                      );
                    })()}

                    {/* Level-1 dropdown panel (Cells + Packs) */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute left-0 top-full pt-2 z-50"
                        >
                          <div
                            className={cn(
                              "min-w-[200px] rounded-xl border p-2 shadow-[0_18px_40px_-12px_rgba(15,15,20,0.18)]",
                              "bg-white/40 backdrop-blur-2xl border-white/50 ring-1 ring-white/30"
                            )}
                          >
                            {item.children.map((child, i) => {
                              if ("href" in child) {
                                // Plain leaf (e.g. Battery Packs)
                                return (
                                  <Link
                                    key={i}
                                    href={child.href}
                                    className="block px-3 py-2.5 rounded-lg text-sm text-[#18181B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A] transition-colors"
                                  >
                                    {child.label}
                                  </Link>
                                );
                              }
                              // Group (e.g. Cells) with its own nested panel
                              const subOpen = openSubLabel === child.label;
                              return (
                                <div
                                  key={i}
                                  className="relative"
                                  onMouseEnter={() => setOpenSubLabel(child.label)}
                                  onMouseLeave={() => setOpenSubLabel(null)}
                                >
                                  <button
                                    type="button"
                                    className={cn(
                                      "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                      subOpen
                                        ? "bg-[#F4F4F5] text-[#0A0A0A]"
                                        : "text-[#18181B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]"
                                    )}
                                  >
                                    <span>{child.label}</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Level-2 flyout (AeroRide / FortiCore) */}
                                  <AnimatePresence>
                                    {subOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -6 }}
                                        transition={{ duration: 0.16, ease: "easeOut" }}
                                        className="absolute left-full top-0 ml-2 z-50"
                                      >
                                        <div
                                          className={cn(
                                            "min-w-[220px] rounded-xl border p-2 shadow-[0_18px_40px_-12px_rgba(15,15,20,0.18)]",
                                            "bg-white/40 backdrop-blur-2xl border-white/50 ring-1 ring-white/30"
                                          )}
                                        >
                                          {child.children.map((leaf, j) => (
                                            <Link
                                              key={j}
                                              href={leaf.href}
                                              className="block px-3 py-2.5 rounded-lg text-sm text-[#18181B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A] transition-colors"
                                            >
                                              {leaf.label}
                                            </Link>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const next = locale === "en" ? "zh" : "en";
                  setLocaleCookie(next);
                  onLocaleChange(next);
                }}
                className="flex items-center gap-1.5 h-10 px-3 text-sm bg-white text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-all duration-200 cursor-pointer shadow-[0_2px_10px_-4px_rgba(0,0,0,0.45)]"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium hidden sm:inline">{locale}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md transition-all duration-200 cursor-pointer text-[#52525B] hover:bg-[#F4F4F5]"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#E4E4E7]">
                <Image
                  src="/logo.png"
                  alt="深安锂能"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-[#F4F4F5]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <nav className="px-6 py-6 space-y-1">
                {navTree.map((item) => {
                  if (item.kind === "leaf") {
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-base font-medium text-[#18181B] hover:text-[#0A0A0A] border-b border-[#F4F4F5]"
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  const expanded = mobileExpandedKey === item.key;
                  return (
                    <div key={item.key} className="border-b border-[#F4F4F5]">
                      <button
                        type="button"
                        onClick={() => setMobileExpandedKey(expanded ? null : item.key)}
                        className="w-full flex items-center justify-between py-3 text-base font-medium text-[#18181B]"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            expanded ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3 pl-3 space-y-1">
                              {item.children.map((child, i) => {
                                if ("href" in child) {
                                  return (
                                    <Link
                                      key={i}
                                      href={child.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="block py-2 text-[15px] text-[#52525B] hover:text-[#0A0A0A]"
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                }
                                return (
                                  <div key={i} className="py-1">
                                    <div className="text-[12px] uppercase tracking-[0.18em] text-[#A1A1AA] mb-1">
                                      {child.label}
                                    </div>
                                    <div className="space-y-1">
                                      {child.children.map((leaf, j) => (
                                        <Link
                                          key={j}
                                          href={leaf.href}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                          className="block py-1.5 text-[15px] text-[#52525B] hover:text-[#0A0A0A]"
                                        >
                                          {leaf.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-6 inline-flex items-center justify-center w-full py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-md hover:bg-[#1D4ED8] transition-colors"
                >
                  {locale === "zh" ? "联系我们" : "Contact Us"}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}