/**
 * Booking destination resolver.
 *
 * If `NEXT_PUBLIC_CALCOM_URL` (or `NEXT_PUBLIC_BOOKING_URL`) is set at build
 * time, "Book a Strategy Call" CTAs link directly to that scheduling page.
 * Otherwise they fall back to the on-site `/contact` form. This keeps the
 * static export portable: deploy without env and the form handles enquiries;
 * set the env var to flip every booking CTA to Cal.com / Calendly without a
 * code change.
 */

const externalUrl =
  process.env.NEXT_PUBLIC_CALCOM_URL || process.env.NEXT_PUBLIC_BOOKING_URL;

export const BOOKING_HREF: string = externalUrl && externalUrl.length > 0
  ? externalUrl
  : "/contact";

export const BOOKING_IS_EXTERNAL: boolean = Boolean(
  externalUrl && /^https?:\/\//i.test(externalUrl),
);
