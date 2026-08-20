"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/* ============================================
   Button Variants - Tesla + DJI Style
   深安锂能国际站 V2.0
   ============================================ */

const buttonVariants = cva(
  // Base styles
  [
    "relative inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-semibold",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[#2563EB] focus-visible:ring-offset-white",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Primary - Dark Black CTA */
        primary: [
          "bg-[#0A0A0A] text-white",
          "hover:bg-[#18181B]",
          "active:bg-[#27272A]",
          "rounded-md",
        ].join(" "),

        /* Secondary - Outlined style */
        secondary: [
          "bg-transparent text-[#0A0A0A]",
          "border border-[#0A0A0A]",
          "hover:bg-[#0A0A0A] hover:text-white",
          "rounded-md",
        ].join(" "),

        /* Accent - Tesla Blue */
        accent: [
          "bg-[#2563EB] text-white",
          "hover:bg-[#1D4ED8]",
          "active:bg-[#1E40AF]",
          "rounded-md",
        ].join(" "),

        /* Ghost - Subtle hover */
        ghost: [
          "bg-transparent text-[#52525B]",
          "hover:text-[#0A0A0A] hover:bg-[#F4F4F5]",
          "active:bg-[#E4E4E7]",
          "rounded-md",
        ].join(" "),

        /* Ghost Dark - For dark backgrounds */
        ghostDark: [
          "bg-transparent text-white/80",
          "hover:text-white hover:bg-white/10",
          "active:bg-white/15",
          "rounded-md",
        ].join(" "),

        /* Outline - Bordered with accent */
        outline: [
          "bg-transparent text-[#2563EB]",
          "border border-[#2563EB]",
          "hover:bg-[#2563EB] hover:text-white",
          "active:bg-[#1D4ED8]",
          "rounded-md",
        ].join(" "),

        /* Danger - Error/Destructive */
        danger: [
          "bg-[#DC2626] text-white",
          "hover:bg-[#B91C1C]",
          "active:bg-[#991B1B]",
          "rounded-md",
        ].join(" "),

        /* Success - Green CTA */
        success: [
          "bg-[#16A34A] text-white",
          "hover:bg-[#15803D]",
          "active:bg-[#166534]",
          "rounded-md",
        ].join(" "),

        /* Link - Accent text */
        link: [
          "text-[#2563EB] underline-offset-4",
          "hover:underline",
          "focus-visible:ring-0",
          "rounded-md",
        ].join(" "),

        /* Glass - For dark backgrounds */
        glass: [
          "bg-white/10 text-white",
          "backdrop-blur-sm border border-white/20",
          "hover:bg-white/20 hover:border-white/30",
          "active:bg-white/15",
          "rounded-md",
        ].join(" "),
      },

      size: {
        /* Size variations - Tesla style */
        xs: "h-7 px-3 text-xs",
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-sm",  // Default - taller
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",

        /* Icon only */
        icon: "h-12 w-12",
        "icon-sm": "h-10 w-10",
        "icon-lg": "h-14 w-14",
      },

      isLoading: {
        true: "cursor-wait",
        false: "",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      isLoading: false,
    },

    compoundVariants: [
      // Loading state for primary
      {
        variant: "primary",
        isLoading: true,
        className: "cursor-wait",
      },
      // Accent hover effect
      {
        variant: "accent",
        isLoading: true,
        className: "cursor-wait",
      },
    ],
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          // Loading animation
          loading && "relative [&>span]:opacity-0",
          // Subtle scale on hover (only when not disabled)
          !isDisabled && !asChild && [
            "hover:-translate-y-0.5",
            "active:translate-y-0",
          ].join(" ")
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}

        {/* Button content */}
        <span className={cn("flex items-center gap-2", loading && "opacity-0")}>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

/* ============================================
   Icon Button - Square with icon only
   ============================================ */

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: React.ReactNode;
  "aria-label": string;
  size?: "sm" | "md" | "lg" | "icon" | "icon-sm" | "icon-lg";
  loading?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = "ghost", size = "icon", icon, "aria-label": ariaLabel, disabled, loading, ...props },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isDisabled}
        loading={loading}
        className={className}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";

/* ============================================
   Button Group
   ============================================ */

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  gap?: "none" | "sm" | "md" | "lg";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", gap = "sm", children, ...props }, ref) => {
    const gapClasses = {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    };

    const orientationClasses = {
      horizontal: "flex-row",
      vertical: "flex-col",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientationClasses[orientation],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

/* ============================================
   Exports
   ============================================ */

export {
  Button,
  IconButton,
  ButtonGroup,
  buttonVariants,
};
