"use client";

import { motion } from "framer-motion";

interface AnimatedLoaderProps {
  type?: "spinner" | "dots" | "bars" | "pulse" | "orbit";
  size?: "small" | "medium" | "large";
  text?: string;
  color?: string;
}

export default function AnimatedLoader({ 
  type = "orbit", 
  size = "medium",
  text = "Loading...",
  color = "var(--primary-500)"
}: AnimatedLoaderProps) {
  
  const sizes = {
    small: { container: 24, dot: 4 },
    medium: { container: 48, dot: 8 },
    large: { container: 80, dot: 12 },
  };

  const currentSize = sizes[size];

  const loaders = {
    spinner: <Spinner size={currentSize} color={color} />,
    dots: <Dots size={currentSize} color={color} />,
    bars: <Bars size={currentSize} color={color} />,
    pulse: <Pulse size={currentSize} color={color} />,
    orbit: <Orbit size={currentSize} color={color} />,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div style={{ width: currentSize.container, height: currentSize.container }}>
        {loaders[type]}
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground-secondary text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

function Spinner({ size, color }: { size: { container: number; dot: number }; color: string }) {
  return (
    <motion.svg
      width={size.container}
      height={size.container}
      viewBox="0 0 24 24"
      fill="none"
      className="mx-auto"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.svg>
  );
}

function Dots({ size, color }: { size: { container: number; dot: number }; color: string }) {
  const dots = [0, 1, 2];
  
  return (
    <div className="flex items-center justify-center gap-2">
      {dots.map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: size.dot,
            height: size.dot,
            backgroundColor: color,
          }}
          animate={{
            y: [-8, 8, -8],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Bars({ size, color }: { size: { container: number; dot: number }; color: string }) {
  const bars = [0, 1, 2, 3, 4];
  
  return (
    <div className="flex items-center justify-center gap-1 h-full">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            height: size.container * 0.6,
            backgroundColor: color,
          }}
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Pulse({ size, color }: { size: { container: number; dot: number }; color: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="rounded-full"
        style={{
          width: size.container * 0.8,
          height: size.container * 0.8,
          backgroundColor: color,
        }}
        animate={{
          scale: [1, 1.5],
          opacity: [1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size.container * 0.8,
          height: size.container * 0.8,
          backgroundColor: color,
        }}
        animate={{
          scale: [1, 1.5],
          opacity: [1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.5,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

function Orbit({ size, color }: { size: { container: number; dot: number }; color: string }) {
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Center dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size.dot * 1.5,
          height: size.dot * 1.5,
          backgroundColor: color,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Orbit path */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: size.container * 0.7,
          height: size.container * 0.7,
          borderColor: `${color}40`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size.dot,
            height: size.dot,
            backgroundColor: color,
            top: -size.dot / 2,
            left: "50%",
            marginLeft: -size.dot / 2,
          }}
        />
      </motion.div>
      
      {/* Second orbit */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: size.container * 0.5,
          height: size.container * 0.5,
          borderColor: `${color}30`,
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size.dot * 0.8,
            height: size.dot * 0.8,
            backgroundColor: color,
            bottom: -size.dot * 0.4,
            right: -size.dot * 0.4,
          }}
        />
      </motion.div>
    </div>
  );
}

// Analysis specific loader
export function AnalysisLoader() {
  const steps = [
    "Fetching repository...",
    "Analyzing code structure...",
    "Generating insights...",
    "Building documentation...",
  ];

  return (
    <div className="glass-card rounded-xl p-6 max-w-md w-full">
      <div className="flex items-center gap-4 mb-6">
        <Orbit size={{ container: 48, dot: 8 }} color="var(--primary-500)" />
        <div>
          <h3 className="font-semibold text-foreground">Analyzing Repository</h3>
          <p className="text-sm text-foreground-secondary">This may take a few moments</p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-primary-500"
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
            <span className="text-sm text-foreground-secondary">{step}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

// Skeleton loader for cards
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="w-12 h-12 rounded-lg bg-border"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="flex-1">
          <motion.div
            className="h-4 bg-border rounded w-3/4 mb-2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="h-3 bg-border rounded w-1/2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <motion.div
          className="h-3 bg-border rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
        <motion.div
          className="h-3 bg-border rounded w-5/6"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />
      </div>
    </div>
  );
}
