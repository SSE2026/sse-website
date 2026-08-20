/**
 * Swift Safe Energy Design System
 * Re-export all design system components from here
 * for cleaner imports across the application
 */

// ============================================
// UI Components
// ============================================

// Button
export {
  Button,
  IconButton,
  ButtonGroup,
  buttonVariants,
} from "@/components/ui/button";
export type { ButtonProps, IconButtonProps, ButtonGroupProps } from "@/components/ui/button";

// Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
  FeatureCard,
  StatsCard,
  ProductCard,
  InteractiveCard,
  Badge,
  SectionTitle,
} from "@/components/ui/card";

// Form Components
export { Input } from "@/components/ui/input";
export { Textarea } from "@/components/ui/textarea";

// Section Components
export { SectionHeader } from "@/components/ui/section-header";

// Scroll & Progress
export { ScrollProgress } from "@/components/ui/scroll-progress";

// Page Transitions
export { PageTransition, LoadingScreen } from "@/components/ui/page-transition";

// Image Effects
export { BlurRevealImage, ParallaxImage, ImageOverlay } from "@/components/ui/image-effects";

// Effects & Animations
export { MouseFollower, AnimatedNumber, TextReveal, TypingEffect, Marquee, PulsingDot, Skeleton } from "@/components/ui/effects";

// UI Animations
export {
  Pulse,
  PulseRing,
  Shimmer,
  GlowPulse,
  Float,
  Spin,
  StaggerChildren,
  StaggerFade,
  CursorFollower,
} from "@/components/ui/animations";

// Hero Scrub - Cinematic scroll animation
export { HeroScrub } from "@/components/ui/hero-scrub";

// Circular Gallery - Auto-rotating gallery
export { default as CircularGallery } from "@/components/ui/circular-gallery";

// ============================================
// Layout Components
// ============================================

export { Header } from "@/components/layout/header";
export { Footer } from "@/components/layout/footer";
export { default as Sidebar } from "@/components/layout/sidebar";

// ============================================
// Animation Components
// ============================================

export { FadeIn } from "@/components/animated/fade-in";
export { ScaleIn } from "@/components/animated/scale-in";
export { SlideIn } from "@/components/animated/slide-in";
export { ParallaxImage as AnimatedParallax } from "@/components/animated/parallax-image";
export { NumberCounter } from "@/components/animated/number-counter";

// ============================================
// Design System Utilities
// ============================================

// Animation variants for Framer Motion
export const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
  stagger: {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  },
} as const;
