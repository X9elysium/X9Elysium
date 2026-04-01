"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

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
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Twitter", href: "https://twitter.com" },
    { name: "Instagram", href: "https://instagram.com" },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-black border-t border-white/10">
      <div className="section-container py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-0.5 mb-6 group">
              <span className="text-2xl font-bold text-white">X9</span>
              <span className="text-2xl font-light text-[#9b9b9b] group-hover:text-[#009eff] transition-colors duration-300">
                Elysium
              </span>
            </Link>
            <p className="text-[#9b9b9b] text-sm leading-relaxed mb-6 max-w-xs">
              Shopify unified commerce consulting for ambitious retailers. We
              build, optimize, and scale commerce ecosystems.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@X9Elysium.com"
                className="flex items-center gap-2.5 text-sm text-[#9b9b9b] hover:text-[#009eff] transition-colors duration-300"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@X9Elysium.com
              </a>
              <a
                href="tel:+16049686952"
                className="flex items-center gap-2.5 text-sm text-[#9b9b9b] hover:text-[#009eff] transition-colors duration-300"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +1 (604) 968-6952
              </a>
              <div className="flex items-center gap-2.5 text-sm text-[#9b9b9b]">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Vancouver, BC
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[0.75rem] font-bold text-white uppercase tracking-[0.15em] mb-5">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9b9b9b] hover:text-[#009eff] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[0.75rem] font-bold text-white uppercase tracking-[0.15em] mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9b9b9b] hover:text-[#009eff] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[0.75rem] font-bold text-white uppercase tracking-[0.15em] mb-5">
              Connect
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#9b9b9b] hover:text-[#009eff] transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9b9b9b]/60">
            &copy; {new Date().getFullYear()} X9Elysium. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-policy"
              className="text-xs text-[#9b9b9b]/60 hover:text-[#009eff] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-policy"
              className="text-xs text-[#9b9b9b]/60 hover:text-[#009eff] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
