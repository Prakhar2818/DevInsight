"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@mui/material";

export default function Navbar() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analyzer", label: "Analyzer" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <nav className="w-full border-b border-[var(--border)] bg-[var(--background-secondary)]/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-bold text-sm">DI</span>
            </motion.div>
            <h1 className="text-xl font-bold text-foreground group-hover:text-primary-400 transition-colors">
              DevInsight <span className="text-primary-500">AI</span>
            </h1>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <div className="flex gap-2 items-center">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                href={link.href} 
                className="relative px-4 py-2 text-foreground-secondary hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                <span className="relative z-10">{link.label}</span>
                {/* Active indicator */}
                {link.href === "/" && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-primary-500/10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button 
            variant="contained"
            className="btn-primary"
            style={{ 
              background: 'var(--gradient-primary)',
              borderRadius: '0.5rem',
            }}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Analyze Repo
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </nav>
  );
}
