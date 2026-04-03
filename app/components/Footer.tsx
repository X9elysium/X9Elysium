"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Store Audits", href: "#services" },
    { name: "Custom Integrations", href: "#services" },
    { name: "Platform Migrations", href: "#services" },
    { name: "Performance Optimization", href: "#services" },
    { name: "Strategy Consulting", href: "#services" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Work", href: "#work" },
    { name: "Blog", href: "/posts" },
    { name: "Contact", href: "/contact" },
  ],
  connect: [
    { name: "Instagram", href: "https://www.instagram.com/x9elysium/" },
    { name: "Facebook", href: "https://www.facebook.com/profile.php?id=100091230745202" },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-black border-t border-white/[0.06]">
      {/* Gradient border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="section-container py-20 sm:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <Image
                src="/images/logo-x9e.png"
                alt="X9Elysium"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="flex items-center gap-0.5">
                <span className="text-2xl font-bold text-white">X9</span>
                <span className="text-2xl font-light text-neutral-500 group-hover:text-emerald-500 transition-colors duration-300">
                  Elysium
                </span>
              </div>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-xs">
              Shopify unified commerce consulting for ambitious retailers. We
              build, optimize, and scale commerce ecosystems.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:darshanpatel1902@gmail.com"
                className="inline-flex items-center gap-2.5 text-sm text-neutral-500 hover:text-emerald-400 hover:translate-x-0.5 transition-all duration-300"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                darshanpatel1902@gmail.com
              </a>
              <a
                href="tel:+16049686952"
                className="inline-flex items-center gap-2.5 text-sm text-neutral-500 hover:text-emerald-400 hover:translate-x-0.5 transition-all duration-300"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +1 (604) 968-6952
              </a>
              <div className="flex items-start gap-2.5 text-sm text-neutral-500">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block">
                    HQ: 28 Ann Street, Mississauga, ON
                  </span>
                  <span className="block">Calgary &bull; Vancouver</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-label-sm uppercase text-white mb-6">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-emerald-400 hover:translate-x-0.5 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-label-sm uppercase text-white mb-6">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-emerald-400 hover:translate-x-0.5 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-label-sm uppercase text-white mb-6">
              Connect
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-500 hover:text-emerald-400 hover:translate-x-0.5 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} X9Elysium. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-policy"
              className="text-xs text-neutral-600 hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-policy"
              className="text-xs text-neutral-600 hover:text-emerald-400 transition-colors"
            >
              Terms of Service
            </Link>
            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="text-xs text-neutral-600 hover:text-emerald-400 transition-colors flex items-center gap-1"
              aria-label="Scroll to top"
            >
              Back to top <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
