"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type AnimationType = 
  | "fade" 
  | "slideUp" 
  | "slideDown" 
  | "slideLeft" 
  | "slideRight" 
  | "scale" 
  | "scaleUp" 
  | "rotate" 
  | "flip";

interface MotionWrapperProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  animation?: AnimationType;
  hoverEffect?: "lift" | "glow" | "scale" | "tilt" | "shine" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

const animations: Record<AnimationType, any> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
  },
  flip: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
  },
};

const hoverEffects = {
  lift: {
    whileHover: { y: -8, transition: { duration: 0.2 } },
  },
  glow: {
    whileHover: { 
      boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
      borderColor: "rgba(139, 92, 246, 0.6)",
      transition: { duration: 0.2 }
    },
  },
  scale: {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  },
  tilt: {
    whileHover: { 
      rotateX: 5,
      rotateY: -5,
      transition: { duration: 0.2 }
    },
  },
  shine: {
    whileHover: { 
      scale: 1.02,
      boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.2 }
    },
  },
  none: {},
};

export default function MotionWrapper({
  children,
  animation = "fade",
  hoverEffect = "lift",
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}: MotionWrapperProps) {
  const animationConfig = animations[animation];
  const hoverConfig = hoverEffects[hoverEffect];

  return (
    <motion.div
      className={className}
      initial={{ ...animationConfig.initial }}
      animate={{ ...animationConfig.animate }}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut" 
      }}
      {...hoverConfig}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Staggered children wrapper for lists
export function StaggeredWrapper({
  children,
  staggerDelay = 0.1,
  className = "",
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({
  children,
  animation = "slideUp",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
}) {
  const animationConfig = animations[animation];

  return (
    <motion.div
      className={className}
      variants={{
        initial: animationConfig.initial,
        animate: { 
          ...animationConfig.animate,
          transition: { duration: 0.5, delay }
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Interactive card with glow effect
export function GlowCard({
  children,
  glowColor = "var(--primary-500)",
  className = "",
}: {
  children: ReactNode;
  glowColor?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`glass-card card-shine ${className}`}
      whileHover={{
        boxShadow: `0 0 30px ${glowColor}30`,
        borderColor: `${glowColor}50`,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Animated button with ripple effect
export function MotionButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
} & HTMLMotionProps<"button">) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "bg-transparent text-foreground hover:bg-white/5",
  };

  return (
    <motion.button
      className={`${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Animated link
export function MotionLink({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLMotionProps<"a">) {
  return (
    <motion.a
      className={`text-foreground-secondary hover:text-foreground transition-colors ${className}`}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
