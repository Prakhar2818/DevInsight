"use client";

import { motion } from "framer-motion";
import MotionWrapper, { StaggeredWrapper, StaggerItem } from "./MotionWrapper";

export default function Hero() {
  return (
    <section className="relative text-center py-24 overflow-hidden">
      {/* Gradient orbs in hero */}
      <motion.div
        className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-1/4 w-48 h-48 rounded-full bg-accent-cyan/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10">
        <MotionWrapper animation="slideUp" delay={0.1} className="mb-6">
          <motion.span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30"
            animate={{
              boxShadow: ["0 0 10px rgba(139, 92, 246, 0.3)", "0 0 20px rgba(139, 92, 246, 0.5)", "0 0 10px rgba(139, 92, 246, 0.3)"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            ✨ AI-Powered Code Analysis
          </motion.span>
        </MotionWrapper>

        <MotionWrapper animation="slideUp" delay={0.2}>
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-gradient">DevInsight</span>{" "}
            <span className="text-foreground">AI</span>
          </motion.h1>
        </MotionWrapper>

        <MotionWrapper animation="slideUp" delay={0.3}>
          <p className="text-xl md:text-2xl text-foreground-secondary max-w-2xl mx-auto mb-8">
            Transform your codebase into actionable insights with advanced AI analysis
          </p>
        </MotionWrapper>

        {/* Feature highlights with staggered animation */}
        <StaggeredWrapper staggerDelay={0.15} className="flex flex-wrap justify-center gap-6 mt-12">
          <StaggerItem animation="scaleUp" delay={0.1}>
            <motion.div
              className="glass-card px-6 py-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, borderColor: "var(--primary-500)" }}
            >
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔍
              </motion.span>
              <span className="text-foreground-secondary">Smart Analysis</span>
            </motion.div>
          </StaggerItem>

          <StaggerItem animation="scaleUp" delay={0.2}>
            <motion.div
              className="glass-card px-6 py-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, borderColor: "var(--primary-500)" }}
            >
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                📊
              </motion.span>
              <span className="text-foreground-secondary">Visual Diagrams</span>
            </motion.div>
          </StaggerItem>

          <StaggerItem animation="scaleUp" delay={0.3}>
            <motion.div
              className="glass-card px-6 py-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.05, borderColor: "var(--primary-500)" }}
            >
              <motion.span
                className="text-2xl"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                📝
              </motion.span>
              <span className="text-foreground-secondary">Auto Docs</span>
            </motion.div>
          </StaggerItem>
        </StaggeredWrapper>
      </div>
    </section>
  );
}
