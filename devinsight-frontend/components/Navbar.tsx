"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analyzer", label: "Analyzer" },
    { href: "/docs", label: "Docs" },
  ];

  // Only show public links if not authenticated
  let visibleLinks = isAuthenticated ? navLinks : [{ href: "/", label: "Home" }];
  
  // Hide Home tab if currently on the Home page
  visibleLinks = visibleLinks.filter(link => !(link.href === "/" && pathname === "/"));

  const isHome = pathname === "/";
  const navClasses = isHome && !isScrolled
    ? "fixed top-0 w-full z-50 bg-transparent transition-all duration-300"
    : "fixed top-0 w-full z-50 border-b border-[var(--border)] bg-[var(--background-secondary)]/80 backdrop-blur-md transition-all duration-300";

  return (
    <nav className={navClasses}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
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
          {visibleLinks.map((link, index) => (
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

        {/* Auth / CTA Buttons */}
        <div className="flex items-center gap-4">
          
          {!isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-2"
            >
              <Link href="/login">
                <button>
                  Log In
                </button>
              </Link>
              <Link href="/signup">
                <button>
                  Sign Up
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/dashboard">
                <button>
                  <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Dashboard
                  </motion.span>
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
