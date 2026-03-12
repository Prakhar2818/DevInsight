"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function FeatureCard({ 
  title, 
  description, 
  icon,
  delay = 0 
}: FeatureCardProps) {
  return (
    <motion.div
      className="glass-card card-shine rounded-xl p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/5 to-accent-cyan/5 opacity-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mb-4"
          whileHover={{ 
            scale: 1.1,
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span 
            className="text-2xl"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
          >
            {icon}
          </motion.span>
        </motion.div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>

        <p className="text-foreground-secondary leading-relaxed">
          {description}
        </p>

        {/* Arrow indicator */}
        <motion.div
          className="mt-4 flex items-center gap-2 text-primary-500"
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm font-medium">Learn more</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
