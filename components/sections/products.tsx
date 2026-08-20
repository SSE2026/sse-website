"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Zap, Battery, Cpu, Settings, Box, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductsProps {
  translations: {
    products: {
      title: string;
      subtitle: string;
      viewDetails: string;
      power: { title: string; desc: string; specs: string };
      storage: { title: string; desc: string; specs: string };
      drone: { title: string; desc: string; specs: string };
      consumer: { title: string; desc: string; specs: string };
    };
  };
  locale: string;
}

const products = [
  {
    key: "power",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    icon: Zap,
    badge: "360-P",
    badgeColor: "bg-[#2563EB]",
    accentColor: "#2563EB",
    specs: ["500Wh/kg", "10C Discharge", "Ultra Safe"],
  },
  {
    key: "storage",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    icon: Battery,
    badge: "400-E",
    badgeColor: "bg-emerald-500",
    accentColor: "#10B981",
    specs: ["400Wh/kg", "8000+ Cycles", "Smart BMS"],
  },
  {
    key: "drone",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    icon: Cpu,
    badge: "460-X",
    badgeColor: "bg-purple-500",
    accentColor: "#A855F7",
    specs: ["460Wh/kg", "Lightweight", "High Power"],
  },
  {
    key: "consumer",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    icon: Settings,
    badge: "System",
    badgeColor: "bg-amber-500",
    accentColor: "#F59E0B",
    specs: ["Custom Design", "Fast Delivery", "Full Support"],
  },
];

export function Products({ translations, locale }: ProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(containerRef, { once: true, margin: "-100px" });
  const isZh = locale === "zh";

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-[#FAFAFA] relative overflow-hidden">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      {/* Section transition gradient - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe-slow" />
      </div>

      <div className="container-padding mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-px bg-[#2563EB]" />
              <span className="text-sm font-semibold text-[#2563EB] uppercase tracking-wider">
                {isZh ? "产品中心" : "Products"}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A]"
            >
              {translations.products.title}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-base text-[#52525B] max-w-md"
          >
            {translations.products.subtitle}
          </motion.p>
        </motion.div>

        {/* Products Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const data = (translations.products as Record<string, {title?: string; desc?: string; specs?: string}>)[product.key];
            const Icon = product.icon;
            const isLarge = index === 0 || index === 3;

            return (
              <motion.div
                key={product.key}
                initial={{ opacity: 0, y: 50 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "group relative",
                  isLarge ? "lg:col-span-2" : ""
                )}
              >
                <Link href="/products/cloudchi-360-p">
                  <div
                    className={cn(
                      "relative rounded-3xl overflow-hidden",
                      "bg-white border border-[#E4E4E7]",
                      "transition-all duration-400",
                      "hover:border-[#D4D4D8] hover:shadow-2xl",
                      isLarge ? "aspect-[16/9]" : "aspect-square lg:aspect-[4/3]"
                    )}
                  >
                    {/* Background Image */}
                    <ProductImage src={product.image} alt={data?.title ?? ''} />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold text-white",
                        product.badgeColor
                      )}>
                        {product.badge}
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ color: product.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {data.title}
                      </h3>
                      <p className="text-sm text-white/70 mb-4 line-clamp-2">
                        {data.desc}
                      </p>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.specs.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs font-mono bg-white/10 rounded text-white/80"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: product.accentColor }}>
                        <span>{isZh ? "了解更多" : "Learn More"}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Hover overlay effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, ${product.accentColor}20, transparent 50%)`
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/products/cloudchi-360-p"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white font-semibold rounded-lg hover:bg-[#18181B] transition-colors group"
          >
            <Box className="w-5 h-5" />
            <span>{isZh ? "查看全部产品" : "View All Products"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Product image with subtle parallax
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    </div>
  );
}
