"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const orbs: FloatingOrb[] = [
    { id: 1, x: 10, y: 20, size: 300, duration: 20, delay: 0 },
    { id: 2, x: 80, y: 60, size: 400, duration: 25, delay: 5 },
    { id: 3, x: 50, y: 80, size: 250, duration: 18, delay: 2 },
    { id: 4, x: 20, y: 50, size: 200, duration: 22, delay: 8 },
    { id: 5, x: 70, y: 30, size: 350, duration: 28, delay: 3 },
  ];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-bg opacity-80" />

      {/* Floating gradient orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.id % 2 === 0 
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0) 70%)'
              : 'radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, rgba(34, 211, 238, 0) 70%)',
            y: orb.id === 1 ? y1 : orb.id === 2 ? y2 : orb.id === 3 ? y3 : 0,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated dots/particles */}
      <ParticleField />

      {/* Subtle scan line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent h-32"
        animate={{
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ top: 0 }}
      />
    </div>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary-400/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
