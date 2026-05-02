"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { BOOKING_HREF, BOOKING_IS_EXTERNAL } from "../lib/booking";

type Variant = "accent" | "primary-light" | "outline";

const variantClass: Record<Variant, string> = {
  "accent": "btn-accent",
  "primary-light": "btn-primary-light",
  "outline": "btn-outline",
};

export function BookingButton({
  children,
  variant = "accent",
  showArrow = true,
  className,
}: {
  children?: ReactNode;
  variant?: Variant;
  showArrow?: boolean;
  className?: string;
}) {
  const label = children ?? "Book a Strategy Call";
  const classes = `${variantClass[variant]}${className ? ` ${className}` : ""}`;

  if (BOOKING_IS_EXTERNAL) {
    return (
      <a
        href={BOOKING_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {label}
        {showArrow && <ArrowRight className="w-4 h-4" />}
      </a>
    );
  }

  return (
    <Link href={BOOKING_HREF} className={classes}>
      {label}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </Link>
  );
}
