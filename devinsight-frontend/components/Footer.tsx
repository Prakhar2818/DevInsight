"use client";

import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on auth pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white pt-24 pb-12 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              <span className="text-sky-500">DevInsight</span> AI
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              AI-Powered Intelligence for Complex Codebases. Analyze, debug, and
              visualize your repository instantly.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="#" className="hover:text-sky-500 transition-colors">
                <FaGithub size={20} />
              </Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">
                <FaTwitter size={20} />
              </Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">
                <FaLinkedin size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} DevInsight AI. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> All
              systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
