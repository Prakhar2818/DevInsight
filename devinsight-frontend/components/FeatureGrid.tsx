"use client";

import FeatureCard from "./FeatureCard"
import { FaRobot, FaBug, FaCodeBranch, FaProjectDiagram, FaFileAlt, FaSearch } from "react-icons/fa"
import { motion } from "framer-motion"

const features = [
  {
    icon: <FaCodeBranch />,
    title: "Repository Analyzer",
    description: "Analyze GitHub repository structure automatically and understand dependencies",
  },
  {
    icon: <FaRobot />,
    title: "AI Code Intelligence",
    description: "Understand architecture and modules with advanced AI analysis",
  },
  {
    icon: <FaBug />,
    title: "Debug Assistant",
    description: "Fix runtime errors faster with AI-powered debugging suggestions",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Architecture Diagrams",
    description: "Visualize project architecture with automatic diagram generation",
  },
  {
    icon: <FaFileAlt />,
    title: "Auto Documentation",
    description: "Generate comprehensive documentation from your codebase",
  },
  {
    icon: <FaSearch />,
    title: "Smart Search",
    description: "Find code patterns and understand code relationships instantly",
  },
]

export default function FeatureGrid() {
  return (
    <div className="py-16">
      {/* Section header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-gradient">Powerful Features</span>
        </motion.h2>
        <motion.p
          className="text-foreground-secondary text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Everything you need to understand, analyze, and improve your codebase
        </motion.p>
      </motion.div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.3 + index * 0.1,
              ease: "easeOut"
            }}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0}
            />
          </motion.div>
        ))}
      </div>

      {/* Background decoration */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent-cyan/10 blur-3xl -z-10"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  )
}
