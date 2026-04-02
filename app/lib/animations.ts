import type { Variants, Transition } from "framer-motion";

// Premium easing curve (Apple/Linear-style)
export const smoothEase = [0.22, 1, 0.36, 1] as const;

// Standard fade-up
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// Blur-to-focus reveal (for hero/key elements only)
export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

// Fade-in without movement
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Scale-in (for cards, icons)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

// Slide from left
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

// Stagger container for grids/lists
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Slower stagger for hero elements
export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Default section transition
export const sectionTransition: Transition = {
  duration: 0.7,
  ease: smoothEase,
};

// Card hover spring
export const cardHoverTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};
