"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

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
    { name: "Contact", href: "#contact" },
  ],
  connect: [
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Twitter", href: "https://twitter.com" },
    { name: "Instagram", href: "https://instagram.com" },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/[0.06]">
      <div className="section-container py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-0.5 mb-6">
              <span className="text-2xl font-bold text-white">X9</span>
              <span className="text-2xl font-light text-zinc-400">
                Elysium
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-xs">
              Shopify unified commerce consulting for ambitious retailers. We
              build, optimize, and scale commerce ecosystems.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@X9Elysium.com"
                className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@X9Elysium.com
              </a>
              <a
                href="tel:+16049686952"
                className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +1 (604) 968-6952
              </a>
              <div className="flex items-center gap-2.5 text-sm text-zinc-500">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Vancouver, BC
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">
              Connect
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} X9Elysium. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-policy"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-policy"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
