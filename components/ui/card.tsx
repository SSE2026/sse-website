"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ============================================
   Card Variants - Tesla + DJI Style
   深安锂能国际站 V2.0
   ============================================ */

const cardVariants = cva(
  [
    "rounded-xl border transition-all duration-300",
    "bg-white border-[#E4E4E7]",
    // Hover animation - Tesla style
    "hover:border-[#D4D4D8] hover:shadow-lg",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Default - Standard white card */
        default: "",

        /* Elevated - Subtle shadow on hover */
        elevated: [
          "shadow-sm",
          "hover:shadow-md hover:-translate-y-1",
        ].join(" "),

        /* Bordered - Light border */
        bordered: [
          "bg-transparent border-[#E4E4E7]",
          "hover:border-[#2563EB] hover:border-opacity-50",
        ].join(" "),

        /* Glass - For dark backgrounds */
        glass: [
          "bg-white/80 backdrop-blur-sm",
          "border-white/20",
          "hover:bg-white/90 hover:shadow-md",
        ].join(" "),

        /* Outline - Subtle border */
        outline: [
          "bg-transparent border-[#E4E4E7]",
          "hover:border-[#A1A1AA]",
        ].join(" "),

        /* Surface - Elevated background */
        surface: [
          "bg-[#F4F4F5] border-transparent",
          "hover:bg-white",
        ].join(" "),
      },

      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",        // Default
        lg: "p-8",
        xl: "p-10",
      },

      hover: {
        true: "cursor-pointer hover:-translate-y-1",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      padding: "md",
      hover: false,
    },
  }
);

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  variant?: "default" | "glass" | "outline" | "elevated" | "surface" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  as?: "div" | "article" | "section";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hover, className }))}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

/* ============================================
   Card Subcomponents
   ============================================ */

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight",
      "text-[#0A0A0A]",
      className
    )}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#52525B]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/* ============================================
   Feature Card - Card with icon header
   ============================================ */

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconColor?: "accent" | "primary" | "success" | "warning" | "error";
  href?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
  iconColor = "accent",
  href,
}: FeatureCardProps) {
  const iconColors = {
    accent: "bg-[#2563EB]/10 text-[#2563EB]",
    primary: "bg-[#0A0A0A] text-white",
    success: "bg-[#16A34A]/10 text-[#16A34A]",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
    error: "bg-[#DC2626]/10 text-[#DC2626]",
  };

  const content = (
    <Card hover className={cn("p-6 group", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
          "transition-transform duration-300 group-hover:scale-110",
          iconColors[iconColor]
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#0A0A0A] mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-sm text-[#52525B] leading-relaxed">{description}</p>
    </Card>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}

/* ============================================
   Stats Card - Metric display card (DJI style)
   ============================================ */

interface StatsCardProps {
  value: number | string;
  unit?: string;
  suffix?: string;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
  format?: "number" | "currency" | "percent";
}

export function StatsCard({
  value,
  unit,
  suffix,
  label,
  icon,
  trend,
  className,
  format = "number",
}: StatsCardProps) {
  const trendColors = {
    up: "text-[#16A34A]",
    down: "text-[#DC2626]",
    neutral: "text-[#52525B]",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  const formattedValue = typeof value === "number"
    ? value.toLocaleString()
    : value;

  return (
    <Card className={cn("p-6 text-center", className)}>
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-3 text-[#2563EB]">
          {icon}
        </div>
      )}
      <div className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-1 font-mono tracking-tight">
        <span className="text-[#2563EB]">{formattedValue}</span>
        {unit && <span className="text-[#2563EB]/70 text-2xl ml-1">{unit}</span>}
        {suffix && <span className="text-[#52525B] text-2xl ml-1">{suffix}</span>}
      </div>
      {trend && (
        <div className={cn("text-sm font-medium", trendColors[trend.direction])}>
          {trendIcons[trend.direction]} {trend.value}%
        </div>
      )}
      <p className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mt-2">{label}</p>
    </Card>
  );
}

/* ============================================
   Product Card - E-commerce style card
   ============================================ */

interface ProductCardProps {
  image: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  badge?: string;
  badgeColor?: "accent" | "success" | "warning" | "error";
  className?: string;
  onAddToCart?: () => void;
}

export function ProductCard({
  image,
  title,
  description,
  price,
  currency = "$",
  badge,
  badgeColor = "accent",
  className,
  onAddToCart,
}: ProductCardProps) {
  const badgeColors = {
    accent: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20",
    success: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20",
    warning: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
    error: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
  };

  return (
    <Card variant="elevated" hover className={cn("overflow-hidden", className)}>
      {/* Image container */}
      <div className="relative aspect-square bg-[#F4F4F5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {badge && (
          <span className={cn(
            "absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded border",
            badgeColors[badgeColor]
          )}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#0A0A0A] mb-1 line-clamp-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[#52525B] mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          {price !== undefined && (
            <span className="text-xl font-bold text-[#0A0A0A] font-mono">
              {currency}{price.toLocaleString()}
            </span>
          )}
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="px-4 py-2 text-sm font-semibold bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ============================================
   Interactive Card - Clickable card wrapper
   ============================================ */

interface InteractiveCardProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  as?: "div" | "article";
}

export function InteractiveCard({
  children,
  href,
  onClick,
  className,
  as: Component = "div",
}: InteractiveCardProps) {
  if (href) {
    return (
      <a href={href} className="block group">
        <div className={cn("transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg", className)}>
          {children}
        </div>
      </a>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn("cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg", className)}
    >
      {children}
    </div>
  );
}

/* ============================================
   Badge Component
   ============================================ */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "success" | "warning" | "error" | "primary" | "secondary";
  className?: string;
}

export function Badge({ children, variant = "accent", className }: BadgeProps) {
  const variants = {
    accent: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20",
    success: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20",
    warning: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
    error: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
    primary: "bg-[#0A0A0A] text-white border-transparent",
    secondary: "bg-[#F4F4F5] text-[#52525B] border-transparent",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1",
      "text-xs font-semibold rounded border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

/* ============================================
   Section Title Component
   ============================================ */

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({ title, subtitle, align = "left", className }: SectionTitleProps) {
  return (
    <div className={cn(
      "max-w-2xl",
      align === "center" && "text-center mx-auto",
      className
    )}>
      <h2 className="text-h2 md:text-h1 text-[#0A0A0A] font-bold tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-body-lg text-[#52525B]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ============================================
   Exports
   ============================================ */

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
