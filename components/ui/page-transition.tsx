"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn("", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Page Loader - Full screen loading animation
interface PageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function PageLoader({ isLoading, onComplete }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-primary flex items-center justify-center"
          onAnimationComplete={onComplete}
        >
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Rotating rings */}
            <motion.div
              className="w-24 h-24 rounded-full border border-accent/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 w-20 h-20 rounded-full border border-accent-light/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 w-16 h-16 rounded-full border border-accent/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Center pulse */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-accent"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                  boxShadow: [
                    "0 0 20px rgba(245, 158, 11, 0.5)",
                    "0 0 40px rgba(245, 158, 11, 0.8)",
                    "0 0 20px rgba(245, 158, 11, 0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-white/40 tracking-widest uppercase"
            >
              Loading
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Loading Screen for page transitions
interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-primary flex items-center justify-center"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Outer ring */}
            <motion.div
              className="w-20 h-20 rounded-full border-2 border-accent/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner ring */}
            <motion.div
              className="absolute inset-2 w-16 h-16 rounded-full border-2 border-accent-light/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Center dot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-accent"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
