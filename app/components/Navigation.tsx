"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-neutral-200 dark:border-white/[0.06] shadow-lg shadow-black/5 dark:shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <nav
          className={`section-container flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "h-[64px] lg:h-[72px]" : "h-[72px] lg:h-[80px]"
          }`}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="flex items-center z-50">
            <Link
              href="/"
              className="flex items-center group transition-transform duration-300 hover:scale-[1.02]"
            >
              <Image
                src="/images/x9-logo.png"
                alt="X9Elysium"
                width={44}
                height={44}
                className="rounded-lg opacity-90"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-label-sm uppercase tracking-[0.12em] transition-colors duration-300 ${
                    isActive
                      ? "text-emerald-500"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* CTA + Theme Toggle + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 text-label-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
            >
              Start a Project
            </Link>

            <ThemeToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-50 p-2 text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-[2px] w-6 bg-current transition-all duration-300 origin-center ${
                    isMobileMenuOpen
                      ? "rotate-45 translate-y-[9px]"
                      : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-current transition-all duration-300 origin-center ${
                    isMobileMenuOpen
                      ? "-rotate-45 -translate-y-[9px]"
                      : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-gradient-to-b from-white via-neutral-50 to-white dark:from-neutral-950 dark:via-black dark:to-black pt-28 px-8 lg:hidden"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white uppercase tracking-wide py-4 border-b border-neutral-200 dark:border-white/[0.04] hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-8"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-accent w-full text-center"
                >
                  Start a Project
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
