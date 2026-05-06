"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode, useCallback } from "react";
import { BOOKING_HREF, BOOKING_IS_EXTERNAL } from "../lib/booking";
import { clarity } from "../lib/clarity";

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
  source = "unknown",
}: {
  children?: ReactNode;
  variant?: Variant;
  showArrow?: boolean;
  className?: string;
  source?: string;
}) {
  const label = children ?? "Book a Strategy Call";
  const classes = `${variantClass[variant]}${className ? ` ${className}` : ""}`;

  const onClick = useCallback(() => {
    clarity.event("booking_clicked");
    clarity.tag("booking_source", source);
    clarity.tag("booking_variant", variant);
    clarity.upgrade("booking_intent");
  }, [source, variant]);

  if (BOOKING_IS_EXTERNAL) {
    return (
      <a
        href={BOOKING_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
        data-track-cta="booking"
        data-track-location={source}
      >
        {label}
        {showArrow && <ArrowRight className="w-4 h-4" />}
      </a>
    );
  }

  return (
    <Link
      href={BOOKING_HREF}
      className={classes}
      onClick={onClick}
      data-track-cta="booking"
      data-track-location={source}
    >
      {label}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </Link>
  );
}
