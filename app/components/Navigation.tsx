"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navItems = [
  { name: "Services", href: "#services" },
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 bg-black transition-all duration-300 ${
          isScrolled ? "border-b border-white/10" : ""
        }`}
      >
        <nav className="section-container flex items-center justify-between h-[100px] lg:h-[100px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 group z-50">
            <span className="text-2xl font-bold text-white tracking-tight">
              X9
            </span>
            <span className="text-2xl font-light text-[#9b9b9b] group-hover:text-[#009eff] transition-colors duration-300">
              Elysium
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[0.875rem] font-bold uppercase tracking-[1.5px] text-white hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#009eff] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden sm:inline-flex btn-primary-light !py-3 !px-6 !text-xs"
            >
              Talk to Us
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-50 p-2 text-white hover:text-[#009eff] transition-colors"
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
            className="fixed inset-0 z-40 bg-black pt-32 px-8 lg:hidden"
          >
            <nav className="flex flex-col gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-light text-white uppercase tracking-wide hover:text-[#009eff] transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-accent w-full text-center"
                >
                  Talk to Us
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
